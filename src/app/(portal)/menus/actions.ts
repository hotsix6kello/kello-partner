"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateStore } from "@/lib/store/data";
import type { Database } from "@/lib/supabase/database.types";

async function requireStoreId(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("로그인이 필요합니다.");
  }

  const store = await getOrCreateStore(supabase, data.user.id);
  return store.id;
}

// Categories -----------------------------------------------------------

export async function createCategory(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const storeId = await requireStoreId(supabase);
  const name = (formData.get("name") as string)?.trim() || "새 카테고리";

  const { data: existing, error: fetchError } = await supabase
    .from("categories")
    .select("order_index")
    .eq("store_id", storeId)
    .order("order_index", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const nextOrder = (existing?.[0]?.order_index ?? -1) + 1;

  const { error } = await supabase
    .from("categories")
    .insert({ store_id: storeId, name, order_index: nextOrder });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/menus");
}

export async function renameCategory(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStoreId(supabase);

  const categoryId = formData.get("categoryId") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!name) {
    throw new Error("카테고리 이름을 입력해 주세요.");
  }

  const { error } = await supabase.from("categories").update({ name }).eq("id", categoryId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/menus");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStoreId(supabase);

  const categoryId = formData.get("categoryId") as string;
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/menus");
}

export async function moveCategory(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const storeId = await requireStoreId(supabase);

  const categoryId = formData.get("categoryId") as string;
  const direction = formData.get("direction") as "up" | "down";

  const { data, error } = await supabase
    .from("categories")
    .select("id, order_index")
    .eq("store_id", storeId)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const index = data.findIndex((row) => row.id === categoryId);
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || targetIndex < 0 || targetIndex >= data.length) {
    return;
  }

  const current = data[index];
  const target = data[targetIndex];

  const { error: error1 } = await supabase
    .from("categories")
    .update({ order_index: target.order_index })
    .eq("id", current.id);

  if (error1) {
    throw new Error(error1.message);
  }

  const { error: error2 } = await supabase
    .from("categories")
    .update({ order_index: current.order_index })
    .eq("id", target.id);

  if (error2) {
    throw new Error(error2.message);
  }

  revalidatePath("/menus");
}

// Menu items -------------------------------------------------------------

export async function createMenuItem(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const storeId = await requireStoreId(supabase);

  const categoryId = formData.get("categoryId") as string;

  const { data: existing, error: fetchError } = await supabase
    .from("menu_items")
    .select("order_index")
    .eq("category_id", categoryId)
    .order("order_index", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const nextOrder = (existing?.[0]?.order_index ?? -1) + 1;

  const { error } = await supabase.from("menu_items").insert({
    category_id: categoryId,
    store_id: storeId,
    name: "새 메뉴",
    price_type: "fixed",
    price: 0,
    duration_min: 30,
    order_index: nextOrder,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/menus");
}

export async function updateMenuItem(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStoreId(supabase);

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const priceType = formData.get("priceType") as Database["public"]["Enums"]["price_type"];
  const durationMin = Number(formData.get("durationMin"));
  const description = (formData.get("description") as string)?.trim();
  const visible = formData.get("visible") === "on";

  if (!name) {
    throw new Error("메뉴명을 입력해 주세요.");
  }

  if (!Number.isFinite(durationMin) || durationMin <= 0 || durationMin % 30 !== 0) {
    throw new Error("소요시간은 30분 단위로 입력해 주세요.");
  }

  const update: Database["public"]["Tables"]["menu_items"]["Update"] = {
    name,
    price_type: priceType,
    duration_min: durationMin,
    description: description || null,
    visible,
  };

  if (priceType === "range") {
    const priceMin = Number(formData.get("priceMin"));
    const priceMax = Number(formData.get("priceMax"));

    if (
      !Number.isFinite(priceMin) ||
      !Number.isFinite(priceMax) ||
      priceMin < 0 ||
      priceMax < 0 ||
      priceMin > priceMax
    ) {
      throw new Error("범위 가격은 최소가가 최대가보다 작거나 같아야 합니다.");
    }

    update.price = null;
    update.price_min = priceMin;
    update.price_max = priceMax;
  } else {
    const price = Number(formData.get("price"));

    if (!Number.isFinite(price) || price < 0) {
      throw new Error("가격을 입력해 주세요.");
    }

    update.price = price;
    update.price_min = null;
    update.price_max = null;
  }

  const { error } = await supabase.from("menu_items").update(update).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/menus");
}

export async function deleteMenuItem(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStoreId(supabase);

  const id = formData.get("id") as string;
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/menus");
}

export async function moveMenuItem(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStoreId(supabase);

  const id = formData.get("id") as string;
  const categoryId = formData.get("categoryId") as string;
  const direction = formData.get("direction") as "up" | "down";

  const { data, error } = await supabase
    .from("menu_items")
    .select("id, order_index")
    .eq("category_id", categoryId)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const index = data.findIndex((row) => row.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || targetIndex < 0 || targetIndex >= data.length) {
    return;
  }

  const current = data[index];
  const target = data[targetIndex];

  const { error: error1 } = await supabase
    .from("menu_items")
    .update({ order_index: target.order_index })
    .eq("id", current.id);

  if (error1) {
    throw new Error(error1.message);
  }

  const { error: error2 } = await supabase
    .from("menu_items")
    .update({ order_index: current.order_index })
    .eq("id", target.id);

  if (error2) {
    throw new Error(error2.message);
  }

  revalidatePath("/menus");
}

// Menu item options (add-ons) ---------------------------------------------

export async function addMenuItemOption(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStoreId(supabase);

  const menuItemId = formData.get("menuItemId") as string;

  const { data: existing, error: fetchError } = await supabase
    .from("menu_item_options")
    .select("order_index")
    .eq("menu_item_id", menuItemId)
    .order("order_index", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const nextOrder = (existing?.[0]?.order_index ?? -1) + 1;

  const { error } = await supabase.from("menu_item_options").insert({
    menu_item_id: menuItemId,
    name: "추가 옵션",
    price: 0,
    order_index: nextOrder,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/menus");
}

export async function updateMenuItemOption(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStoreId(supabase);

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const price = Number(formData.get("price"));

  if (!name) {
    throw new Error("옵션 이름을 입력해 주세요.");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("옵션 가격을 입력해 주세요.");
  }

  const { error } = await supabase.from("menu_item_options").update({ name, price }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/menus");
}

export async function deleteMenuItemOption(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStoreId(supabase);

  const id = formData.get("id") as string;
  const { error } = await supabase.from("menu_item_options").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/menus");
}
