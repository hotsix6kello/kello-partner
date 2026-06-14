"use client";

import type { CategoryOption } from "@/lib/menu/data";
import type { PhotoSlot, PhotoSlotType } from "@/lib/photos/data";
import PhotoSlotCard from "./PhotoSlotCard";
import { slotTypeDescriptions, slotTypeLabels } from "./constants";
import styles from "./photos.module.css";

const slotGroupOrder: PhotoSlotType[] = ["representative", "interior", "treatment"];

export default function PhotoEditor({
  slots,
  photoUrls,
  categories,
}: {
  slots: PhotoSlot[];
  photoUrls: Record<string, string>;
  categories: CategoryOption[];
}) {
  return (
    <div className={styles.editor}>
      {slotGroupOrder.map((slotType) => (
        <div key={slotType} className={styles.slotGroup}>
          <div className={styles.slotGroupHeader}>
            <h3 className={styles.slotGroupTitle}>{slotTypeLabels[slotType]}</h3>
            <p className={styles.slotGroupText}>{slotTypeDescriptions[slotType]}</p>
          </div>

          <div className={slotType === "representative" ? styles.slotGridSingle : styles.slotGrid}>
            {slots
              .filter((slot) => slot.slotType === slotType)
              .map((slot) => (
                <PhotoSlotCard
                  key={`${slot.slotType}-${slot.slotIndex}`}
                  slot={slot}
                  imageUrl={slot.photo ? photoUrls[slot.photo.id] ?? null : null}
                  categories={categories}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
