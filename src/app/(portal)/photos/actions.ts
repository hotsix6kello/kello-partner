"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireApprovedPartnerStore } from "@/lib/store/data";
import type { Database } from "@/lib/supabase/database.types";
import type { PhotoSlotType } from "@/lib/photos/data";
import { MAX_PHOTO_SIZE_BYTES } from "./constants";

async function requireStore(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("로그인이 필요합니다.");
  }

  return requireApprovedPartnerStore(supabase);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function fileExtension(file: File) {
  const fromName = file.name.split(".").pop();

  if (fromName && fromName.length <= 5) {
    return fromName.toLowerCase();
  }

  return file.type.split("/").pop() || "jpg";
}

export async function uploadPhoto(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const store = await requireStore(supabase);

  const slotType = formData.get("slotType") as PhotoSlotType;
  const slotIndex = Number(formData.get("slotIndex"));
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    throw new Error("이미지 파일을 선택해 주세요.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    throw new Error("이미지 용량은 8MB 이하여야 합니다.");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("photos")
    .select("id, storage_path")
    .eq("store_id", store.id)
    .eq("slot_type", slotType)
    .eq("slot_index", slotIndex)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const path = `${store.id}/${slotType}/${slotIndex}-${Date.now()}.${fileExtension(file)}`;

  const { error: uploadError } = await supabase.storage.from("store-photos").upload(path, file, {
    contentType: file.type,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from("photos")
      .update({ storage_path: path, crop: null })
      .eq("id", existing.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    if (existing.storage_path) {
      await supabase.storage.from("store-photos").remove([existing.storage_path]);
    }
  } else {
    const { error: insertError } = await supabase.from("photos").insert({
      store_id: store.id,
      slot_type: slotType,
      slot_index: slotIndex,
      storage_path: path,
      order_index: slotIndex,
    });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  revalidatePath("/photos");
}

export async function deletePhoto(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStore(supabase);

  const id = formData.get("id") as string;

  const { data: photo, error: fetchError } = await supabase
    .from("photos")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const { error } = await supabase.from("photos").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  if (photo?.storage_path) {
    await supabase.storage.from("store-photos").remove([photo.storage_path]);
  }

  revalidatePath("/photos");
}

export async function updatePhotoCategory(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStore(supabase);

  const id = formData.get("id") as string;
  const categoryId = (formData.get("categoryId") as string) || null;

  const { error } = await supabase.from("photos").update({ category_id: categoryId }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/photos");
}

export async function updatePhotoCrop(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStore(supabase);

  const id = formData.get("id") as string;
  const x = clamp(Number(formData.get("x")), 0, 100);
  const y = clamp(Number(formData.get("y")), 0, 100);

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error("위치 값이 올바르지 않습니다.");
  }

  const { error } = await supabase.from("photos").update({ crop: { x, y } }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/photos");
}
