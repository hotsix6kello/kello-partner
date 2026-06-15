import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type StorePublicFields = Pick<
  Database["public"]["Tables"]["stores"]["Row"],
  "id" | "name" | "description" | "phone" | "address" | "business_types"
>;
type CategoryRow = Pick<Database["public"]["Tables"]["categories"]["Row"], "id" | "name" | "order_index">;
type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"] & {
  menu_item_options: Database["public"]["Tables"]["menu_item_options"]["Row"][];
};
type PhotoRow = Database["public"]["Tables"]["photos"]["Row"];

export type PublicStoreCatalog = StorePublicFields & {
  categories: (CategoryRow & { menu_items: MenuItemRow[] })[];
  photos: (PhotoRow & { public_url: string | null })[];
};

export async function getApprovedPublicStoreCatalog(
  supabase: SupabaseClient<Database>,
  storeId: string,
): Promise<PublicStoreCatalog | null> {
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id, name, description, phone, address, business_types")
    .eq("id", storeId)
    .maybeSingle();

  if (storeError) {
    throw new Error(storeError.message);
  }

  if (!store) {
    return null;
  }

  const [{ data: categories, error: categoriesError }, { data: menuItems, error: menuError }, { data: photos, error: photosError }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id, name, order_index")
        .eq("store_id", storeId)
        .order("order_index", { ascending: true }),
      supabase
        .from("menu_items")
        .select("*, menu_item_options(*)")
        .eq("store_id", storeId)
        .eq("visible", true)
        .eq("review_status", "approved")
        .order("order_index", { ascending: true }),
      supabase
        .from("photos")
        .select("*")
        .eq("store_id", storeId)
        .eq("review_status", "approved")
        .order("order_index", { ascending: true }),
    ]);

  if (categoriesError || menuError || photosError) {
    throw new Error((categoriesError ?? menuError ?? photosError)?.message ?? "Failed to load catalog.");
  }

  const items = (menuItems ?? []) as MenuItemRow[];
  const categoryList = (categories ?? []).map((category) => ({
    ...category,
    menu_items: items
      .filter((item) => item.category_id === category.id)
      .map((item) => ({
        ...item,
        menu_item_options: [...(item.menu_item_options ?? [])].sort(
          (a, b) => a.order_index - b.order_index,
        ),
      })),
  }));

  const approvedPhotos = ((photos ?? []) as PhotoRow[]).map((photo) => ({
    ...photo,
    public_url: photo.storage_path
      ? supabase.storage.from("store-photos").getPublicUrl(photo.storage_path).data.publicUrl
      : null,
  }));

  return {
    ...store,
    categories: categoryList,
    photos: approvedPhotos,
  };
}
