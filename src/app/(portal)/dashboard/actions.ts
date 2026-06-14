"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { categoryPresets, type BusinessType } from "@/lib/menu/presets";

// Updates the store's basic profile shown to customers (name, intro, contact, address).
export async function updateStoreProfile(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("로그인이 필요합니다.");
  }

  const name = (formData.get("name") as string).trim();
  const description = (formData.get("description") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const address = (formData.get("address") as string).trim();

  if (!name) {
    throw new Error("상호명을 입력해주세요.");
  }

  const { error } = await supabase
    .from("stores")
    .update({ name, description, phone, address })
    .eq("owner_id", userData.user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

// Updates the store's business types and seeds default categories for any
// newly selected type (skipping names that already exist for this store).
export async function updateStoreBusinessTypes(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("로그인이 필요합니다.");
  }

  const selected = formData.getAll("businessTypes") as BusinessType[];

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id, business_types")
    .eq("owner_id", userData.user.id)
    .single();

  if (storeError) {
    throw new Error(storeError.message);
  }

  const previousTypes = new Set(store.business_types);
  const newlyAdded = selected.filter((type) => !previousTypes.has(type));

  const { error: updateError } = await supabase
    .from("stores")
    .update({ business_types: selected })
    .eq("id", store.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  if (newlyAdded.length > 0) {
    const { data: existingCategories, error: categoriesError } = await supabase
      .from("categories")
      .select("name, order_index")
      .eq("store_id", store.id);

    if (categoriesError) {
      throw new Error(categoriesError.message);
    }

    const existingNames = new Set(existingCategories?.map((category) => category.name) ?? []);
    let nextOrder =
      (existingCategories?.reduce((max, category) => Math.max(max, category.order_index), -1) ?? -1) + 1;

    const rowsToInsert: { store_id: string; name: string; order_index: number }[] = [];

    for (const type of newlyAdded) {
      for (const name of categoryPresets[type]) {
        if (existingNames.has(name)) {
          continue;
        }

        rowsToInsert.push({ store_id: store.id, name, order_index: nextOrder });
        existingNames.add(name);
        nextOrder += 1;
      }
    }

    if (rowsToInsert.length > 0) {
      const { error: insertError } = await supabase.from("categories").insert(rowsToInsert);

      if (insertError) {
        throw new Error(insertError.message);
      }
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/menus");
}
