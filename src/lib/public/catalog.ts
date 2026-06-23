import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type StoreRow = Pick<
  Database["public"]["Tables"]["stores"]["Row"],
  "id" | "name" | "description" | "phone" | "address" | "business_types"
>;
type CategoryRow = Pick<
  Database["public"]["Tables"]["categories"]["Row"],
  "id" | "name" | "order_index"
>;
type MenuOptionRow = Database["public"]["Tables"]["menu_item_options"]["Row"];
type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"] & {
  menu_item_options: MenuOptionRow[];
};
type PhotoRow = Database["public"]["Tables"]["photos"]["Row"];
type BusinessHourRow = Database["public"]["Tables"]["business_hours"]["Row"];

export type PublicPhoto = {
  id: string;
  categoryId: string | null;
  crop: unknown;
  orderIndex: number;
  slotIndex: number;
  slotType: string;
  url: string | null;
};

export type PublicMenuOption = {
  id: string;
  menuItemId: string;
  name: string;
  orderIndex: number;
  price: number;
};

export type PublicMenuItem = {
  id: string;
  categoryId: string;
  description: string | null;
  durationMin: number;
  name: string;
  options: PublicMenuOption[];
  orderIndex: number;
  price: number | null;
  priceMax: number | null;
  priceMin: number | null;
  priceType: string;
  storeId: string;
};

export type PublicCategory = {
  id: string;
  menuItems: PublicMenuItem[];
  name: string;
  orderIndex: number;
};

export type PublicPriceRange = {
  max: number;
  min: number;
};

export type PublicOpeningSummary = {
  days: number[];
  text: string;
};

export type PublicStoreSummary = {
  address: string;
  businessTypes: string[];
  category: string | null;
  description: string;
  id: string;
  name: string;
  openingSummary: PublicOpeningSummary | null;
  priceRange: PublicPriceRange | null;
  representativePhoto: PublicPhoto | null;
};

export type PublicStoreDetail = PublicStoreSummary & {
  categories: PublicCategory[];
  menuItemIds: string[];
  phone: string;
  photos: PublicPhoto[];
  storeId: string;
};

type StorePayloadInput = {
  businessHours?: BusinessHourRow[];
  categories?: CategoryRow[];
  menuItems?: MenuItemRow[];
  photos?: PhotoRow[];
  store: StoreRow;
};

function toPublicUrl(supabase: SupabaseClient<Database>, storagePath: string | null) {
  if (!storagePath) {
    return null;
  }

  return supabase.storage.from("store-photos").getPublicUrl(storagePath).data.publicUrl;
}

function toPublicPhoto(supabase: SupabaseClient<Database>, photo: PhotoRow): PublicPhoto {
  return {
    id: photo.id,
    categoryId: photo.category_id,
    crop: photo.crop,
    orderIndex: photo.order_index,
    slotIndex: photo.slot_index,
    slotType: photo.slot_type,
    url: toPublicUrl(supabase, photo.storage_path),
  };
}

function toPublicMenuOption(option: MenuOptionRow): PublicMenuOption {
  return {
    id: option.id,
    menuItemId: option.menu_item_id,
    name: option.name,
    orderIndex: option.order_index,
    price: option.price,
  };
}

function toPublicMenuItem(item: MenuItemRow): PublicMenuItem {
  return {
    id: item.id,
    categoryId: item.category_id,
    description: item.description,
    durationMin: item.duration_min,
    name: item.name,
    options: [...(item.menu_item_options ?? [])]
      .sort((a, b) => a.order_index - b.order_index)
      .map(toPublicMenuOption),
    orderIndex: item.order_index,
    price: item.price,
    priceMax: item.price_max,
    priceMin: item.price_min,
    priceType: item.price_type,
    storeId: item.store_id,
  };
}

function getPriceRange(menuItems: MenuItemRow[]): PublicPriceRange | null {
  const prices = menuItems.flatMap((item) => {
    if (item.price_type === "range") {
      return [item.price_min, item.price_max].filter((price): price is number => price !== null);
    }

    return item.price === null ? [] : [item.price];
  });

  if (prices.length === 0) {
    return null;
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

function formatTime(time: string | null) {
  return time ? time.slice(0, 5) : null;
}

function getOpeningSummary(hours: BusinessHourRow[] = []): PublicOpeningSummary | null {
  const openHours = hours
    .filter((hour) => hour.is_open)
    .sort((a, b) => a.day_of_week - b.day_of_week);

  if (openHours.length === 0) {
    return null;
  }

  const first = openHours[0];
  const start = formatTime(first.start_time);
  const end = formatTime(first.end_time);
  const timeText = start && end ? `${start}-${end}` : "운영 시간 확인 필요";

  return {
    days: openHours.map((hour) => hour.day_of_week),
    text: `주 ${openHours.length}일 ${timeText}`,
  };
}

function getRepresentativePhoto(photos: PublicPhoto[]) {
  return (
    photos.find((photo) => photo.slotType === "representative" && photo.url) ??
    photos.find((photo) => photo.url) ??
    null
  );
}

export function buildPublicStorePayload(
  supabase: SupabaseClient<Database>,
  input: StorePayloadInput,
): PublicStoreDetail {
  const menuItems = input.menuItems ?? [];
  const publicPhotos = (input.photos ?? []).map((photo) => toPublicPhoto(supabase, photo));
  const publicMenuItems = menuItems.map(toPublicMenuItem);
  const categories = (input.categories ?? [])
    .map((category) => ({
      id: category.id,
      menuItems: publicMenuItems.filter((item) => item.categoryId === category.id),
      name: category.name,
      orderIndex: category.order_index,
    }))
    .filter((category) => category.menuItems.length > 0);

  const summary: PublicStoreSummary = {
    address: input.store.address,
    businessTypes: input.store.business_types,
    category: input.store.business_types[0] ?? null,
    description: input.store.description,
    id: input.store.id,
    name: input.store.name,
    openingSummary: getOpeningSummary(input.businessHours),
    priceRange: getPriceRange(menuItems),
    representativePhoto: getRepresentativePhoto(publicPhotos),
  };

  return {
    ...summary,
    categories,
    menuItemIds: publicMenuItems.map((item) => item.id),
    phone: input.store.phone,
    photos: publicPhotos,
    storeId: input.store.id,
  };
}

export function toPublicStoreSummary(detail: PublicStoreDetail): PublicStoreSummary {
  return {
    address: detail.address,
    businessTypes: detail.businessTypes,
    category: detail.category,
    description: detail.description,
    id: detail.id,
    name: detail.name,
    openingSummary: detail.openingSummary,
    priceRange: detail.priceRange,
    representativePhoto: detail.representativePhoto,
  };
}

async function getPublicStoreParts(supabase: SupabaseClient<Database>, storeId: string) {
  const [{ data: store, error: storeError }, { data: categories, error: categoriesError }, { data: menuItems, error: menuError }, { data: photos, error: photosError }, { data: businessHours, error: hoursError }] =
    await Promise.all([
      supabase
        .from("stores")
        .select("id, name, description, phone, address, business_types, partners!inner(status, contract_status, is_public)")
        .eq("id", storeId)
        .eq("partners.status", "approved")
        .eq("partners.contract_status", "signed")
        .eq("partners.is_public", true)
        .maybeSingle(),
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
      supabase
        .from("business_hours")
        .select("*")
        .eq("store_id", storeId)
        .order("day_of_week", { ascending: true }),
    ]);

  if (storeError || categoriesError || menuError || photosError || hoursError) {
    throw new Error(
      (storeError ?? categoriesError ?? menuError ?? photosError ?? hoursError)?.message ??
        "Failed to load public catalog.",
    );
  }

  if (!store) {
    return null;
  }

  return {
    businessHours: businessHours ?? [],
    categories: categories ?? [],
    menuItems: (menuItems ?? []) as MenuItemRow[],
    photos: photos ?? [],
    store,
  };
}

export async function getPublicStoreDetail(
  supabase: SupabaseClient<Database>,
  storeId: string,
): Promise<PublicStoreDetail | null> {
  const parts = await getPublicStoreParts(supabase, storeId);

  if (!parts) {
    return null;
  }

  return buildPublicStorePayload(supabase, parts);
}

export async function getPublicStores(
  supabase: SupabaseClient<Database>,
): Promise<PublicStoreSummary[]> {
  const { data: stores, error } = await supabase
    .from("stores")
    .select("id, name, description, phone, address, business_types, partners!inner(status, contract_status, is_public)")
    .eq("partners.status", "approved")
    .eq("partners.contract_status", "signed")
    .eq("partners.is_public", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!stores || stores.length === 0) {
    return [];
  }

  const details = await Promise.all(
    stores.map(async (store) => {
      const parts = await getPublicStoreParts(supabase, store.id);

      if (!parts) {
        return null;
      }

      return toPublicStoreSummary(buildPublicStorePayload(supabase, parts));
    }),
  );

  return details.filter((detail): detail is PublicStoreSummary => detail !== null);
}

export const getApprovedPublicStoreCatalog = getPublicStoreDetail;
