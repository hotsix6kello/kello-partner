"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdminReviewAccess } from "@/lib/admin/reviews";
import type { Database } from "@/lib/supabase/database.types";

type ReviewStatus = Extract<Database["public"]["Enums"]["review_status"], "approved" | "rejected">;

function readReviewForm(formData: FormData): {
  id: string;
  status: ReviewStatus;
  reason: string | null;
} {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ReviewStatus;
  const reason = String(formData.get("reason") ?? "").trim() || null;

  if (!id || (status !== "approved" && status !== "rejected")) {
    throw new Error("검수 요청이 올바르지 않습니다.");
  }

  return { id, status, reason: status === "rejected" ? reason : null };
}

export async function reviewMenuItem(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const access = await requireAdminReviewAccess(supabase);
  const { id, status, reason } = readReviewForm(formData);

  const { error } = await supabase
    .from("menu_items")
    .update({
      review_status: status,
      review_reason: reason,
      reviewed_at: new Date().toISOString(),
      reviewed_by: access.user.id,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to review menu item", error);
    throw new Error("검수 처리에 실패했습니다.");
  }

  revalidatePath("/admin/reviews");
}

export async function reviewPhoto(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const access = await requireAdminReviewAccess(supabase);
  const { id, status, reason } = readReviewForm(formData);

  const { error } = await supabase
    .from("photos")
    .update({
      review_status: status,
      review_reason: reason,
      reviewed_at: new Date().toISOString(),
      reviewed_by: access.user.id,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to review photo", error);
    throw new Error("검수 처리에 실패했습니다.");
  }

  revalidatePath("/admin/reviews");
}
