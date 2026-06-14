import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type MenuItemOption = Database["public"]["Tables"]["menu_item_options"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"] & {
  menu_item_options: MenuItemOption[];
};
export type Category = Database["public"]["Tables"]["categories"]["Row"] & {
  menu_items: MenuItem[];
};
export type CategoryOption = Pick<Database["public"]["Tables"]["categories"]["Row"], "id" | "name">;

export async function getCategoryOptions(
  supabase: SupabaseClient<Database>,
  storeId: string,
): Promise<CategoryOption[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("store_id", storeId)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getCategoriesWithMenuItems(
  supabase: SupabaseClient<Database>,
  storeId: string,
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*, menu_items(*, menu_item_options(*))")
    .eq("store_id", storeId)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const categories = (data ?? []) as Category[];

  for (const category of categories) {
    category.menu_items.sort((a, b) => a.order_index - b.order_index);
    for (const item of category.menu_items) {
      item.menu_item_options.sort((a, b) => a.order_index - b.order_index);
    }
  }

  return categories;
}
