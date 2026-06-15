"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import type { CategoryOption } from "@/lib/menu/data";
import type { PhotoSlot } from "@/lib/photos/data";
import { parseCrop } from "@/lib/photos/data";
import { reviewStatusLabels } from "../menus/constants";
import { deletePhoto, updatePhotoCategory, updatePhotoCrop, uploadPhoto } from "./actions";
import styles from "./photos.module.css";

export default function PhotoSlotCard({
  slot,
  imageUrl,
  categories,
}: {
  slot: PhotoSlot;
  imageUrl: string | null;
  categories: CategoryOption[];
}) {
  const { photo, slotType } = slot;
  const crop = parseCrop(photo?.crop);
  const [previewCrop, setPreviewCrop] = useState(crop);

  const badgeClass = !photo
    ? ""
    : photo.review_status === "approved"
      ? styles.badgeApproved
      : photo.review_status === "rejected"
        ? styles.badgeRejected
        : styles.badgePending;

  return (
    <div className={styles.slotCard}>
      <div className={styles.preview}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            unoptimized
            className={styles.previewImage}
            sizes="(max-width: 768px) 100vw, 360px"
            style={
              slotType === "representative"
                ? { objectPosition: `${previewCrop.x}% ${previewCrop.y}%` }
                : undefined
            }
          />
        ) : (
          <span className={styles.previewPlaceholder}>
            <ImagePlus size={20} strokeWidth={2} />
          </span>
        )}
        {photo ? (
          <span className={`${styles.badge} ${badgeClass}`}>{reviewStatusLabels[photo.review_status]}</span>
        ) : null}
      </div>

      {photo?.review_status === "rejected" && photo.review_reason ? (
        <p className={styles.rejectReason}>반려 사유: {photo.review_reason}</p>
      ) : null}

      <form action={uploadPhoto} className={styles.uploadForm}>
        <input type="hidden" name="slotType" value={slot.slotType} />
        <input type="hidden" name="slotIndex" value={slot.slotIndex} />
        <label className={styles.fileLabel}>
          {photo ? "이미지 교체" : "이미지 업로드"}
          <input type="file" name="file" accept="image/*" required className={styles.fileInput} />
        </label>
        <button type="submit" className={styles.saveButton}>
          업로드
        </button>
      </form>

      {photo && slotType === "treatment" ? (
        <form action={updatePhotoCategory} className={styles.categoryForm}>
          <input type="hidden" name="id" value={photo.id} />
          <select name="categoryId" defaultValue={photo.category_id ?? ""} className={styles.categorySelect}>
            <option value="">카테고리 없음</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.saveButton}>
            태그 저장
          </button>
        </form>
      ) : null}

      {photo && slotType === "representative" ? (
        <form action={updatePhotoCrop} className={styles.cropForm}>
          <input type="hidden" name="id" value={photo.id} />
          <div className={styles.cropField}>
            <label className={styles.fieldLabel}>가로 위치</label>
            <input
              type="range"
              name="x"
              min={0}
              max={100}
              defaultValue={crop.x}
              onChange={(event) => setPreviewCrop((prev) => ({ ...prev, x: Number(event.target.value) }))}
              className={styles.cropSlider}
            />
          </div>
          <div className={styles.cropField}>
            <label className={styles.fieldLabel}>세로 위치</label>
            <input
              type="range"
              name="y"
              min={0}
              max={100}
              defaultValue={crop.y}
              onChange={(event) => setPreviewCrop((prev) => ({ ...prev, y: Number(event.target.value) }))}
              className={styles.cropSlider}
            />
          </div>
          <button type="submit" className={styles.saveButton}>
            위치 저장
          </button>
        </form>
      ) : null}

      {photo ? (
        <form
          action={deletePhoto}
          onSubmit={(event) => {
            if (!window.confirm("이 사진을 삭제할까요?")) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={photo.id} />
          <button type="submit" className={`${styles.iconButton} ${styles.iconButtonDanger}`}>
            <Trash2 size={16} strokeWidth={2.2} />
            사진 삭제
          </button>
        </form>
      ) : null}
    </div>
  );
}
