import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type Photo = Database["public"]["Tables"]["photos"]["Row"];
export type PhotoSlotType = Database["public"]["Enums"]["photo_slot_type"];

export type PhotoCrop = { x: number; y: number };

export type PhotoSlot = {
  slotType: PhotoSlotType;
  slotIndex: number;
  photo: Photo | null;
};

export const PHOTO_SLOT_LAYOUT: { slotType: PhotoSlotType; indexes: number[] }[] = [
  { slotType: "representative", indexes: [0] },
  { slotType: "interior", indexes: [1, 2, 3] },
  { slotType: "treatment", indexes: [1, 2, 3, 4] },
];

export async function getPhotoSlots(
  supabase: SupabaseClient<Database>,
  storeId: string,
): Promise<PhotoSlot[]> {
  const { data, error } = await supabase.from("photos").select("*").eq("store_id", storeId);

  if (error) {
    throw new Error(error.message);
  }

  const photos = data ?? [];
  const slots: PhotoSlot[] = [];

  for (const { slotType, indexes } of PHOTO_SLOT_LAYOUT) {
    for (const slotIndex of indexes) {
      const photo =
        photos.find((row) => row.slot_type === slotType && row.slot_index === slotIndex) ?? null;
      slots.push({ slotType, slotIndex, photo });
    }
  }

  return slots;
}

export function parseCrop(crop: unknown): PhotoCrop {
  if (crop && typeof crop === "object" && "x" in crop && "y" in crop) {
    const x = Number((crop as { x: unknown }).x);
    const y = Number((crop as { y: unknown }).y);

    if (Number.isFinite(x) && Number.isFinite(y)) {
      return { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) };
    }
  }

  return { x: 50, y: 50 };
}
