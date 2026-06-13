"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { MenuItem } from "@/lib/menu/data";
import type { Database } from "@/lib/supabase/database.types";
import { addMenuItemOption, deleteMenuItem, moveMenuItem, updateMenuItem } from "./actions";
import OptionRow from "./OptionRow";
import { durationOptions, priceTypeLabels, reviewStatusLabels } from "./constants";
import styles from "./menus.module.css";

type PriceType = Database["public"]["Enums"]["price_type"];

export default function MenuItemCard({
  item,
  categoryId,
  isFirst,
  isLast,
}: {
  item: MenuItem;
  categoryId: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [priceType, setPriceType] = useState<PriceType>(item.price_type);

  const badgeClass =
    item.review_status === "approved"
      ? styles.badgeApproved
      : item.review_status === "rejected"
        ? styles.badgeRejected
        : styles.badgePending;

  return (
    <div className={styles.menuItemCard}>
      <form action={updateMenuItem} className={styles.fieldGrid}>
        <input type="hidden" name="id" value={item.id} />

        <div className={styles.menuItemTopRow} style={{ gridColumn: "1 / -1" }}>
          <input
            type="text"
            name="name"
            defaultValue={item.name}
            className={styles.menuItemNameInput}
            required
          />
          <span className={`${styles.badge} ${badgeClass}`}>{reviewStatusLabels[item.review_status]}</span>
        </div>

        {item.review_status === "rejected" && item.review_reason ? (
          <p className={styles.rejectReason} style={{ gridColumn: "1 / -1" }}>
            반려 사유: {item.review_reason}
          </p>
        ) : null}

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>가격 표기</label>
          <select
            name="priceType"
            value={priceType}
            onChange={(event) => setPriceType(event.target.value as PriceType)}
            className={styles.fieldSelect}
          >
            {Object.entries(priceTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {priceType === "range" ? (
          <div className={styles.fieldGroup} style={{ gridColumn: "span 2" }}>
            <label className={styles.fieldLabel}>가격 범위(원, 최소~최대)</label>
            <div className={styles.priceFields}>
              <input
                type="number"
                name="priceMin"
                min={0}
                step={100}
                defaultValue={item.price_min ?? 0}
                className={styles.fieldInput}
                required
              />
              <input
                type="number"
                name="priceMax"
                min={0}
                step={100}
                defaultValue={item.price_max ?? 0}
                className={styles.fieldInput}
                required
              />
            </div>
          </div>
        ) : (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{priceType === "from" ? "시작 가격(원)" : "가격(원)"}</label>
            <input
              type="number"
              name="price"
              min={0}
              step={100}
              defaultValue={item.price ?? 0}
              className={styles.fieldInput}
              required
            />
          </div>
        )}

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>소요 시간</label>
          <select name="durationMin" defaultValue={item.duration_min} className={styles.fieldSelect}>
            {durationOptions.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes}분
              </option>
            ))}
          </select>
        </div>

        <div className={styles.visibleField}>
          <input
            type="checkbox"
            id={`visible-${item.id}`}
            name="visible"
            defaultChecked={item.visible}
            className={styles.visibleCheckbox}
          />
          <label htmlFor={`visible-${item.id}`} className={styles.fieldLabel}>
            고객 화면에 노출
          </label>
        </div>

        <div className={styles.fieldGroup} style={{ gridColumn: "1 / -1" }}>
          <label className={styles.fieldLabel}>설명</label>
          <textarea
            name="description"
            defaultValue={item.description ?? ""}
            className={styles.fieldTextarea}
            placeholder="추천 포인트, 관리 팁 등"
          />
        </div>

        <div className={styles.menuItemFooter} style={{ gridColumn: "1 / -1" }}>
          <div className={styles.reorderGroup}>
            <FormButton action={moveMenuItem} hidden={{ id: item.id, categoryId, direction: "up" }} disabled={isFirst} label="메뉴 위로 이동">
              <ArrowUp size={16} strokeWidth={2.2} />
            </FormButton>
            <FormButton action={moveMenuItem} hidden={{ id: item.id, categoryId, direction: "down" }} disabled={isLast} label="메뉴 아래로 이동">
              <ArrowDown size={16} strokeWidth={2.2} />
            </FormButton>
          </div>
          <button type="submit" className={styles.saveButton}>
            저장
          </button>
        </div>
      </form>

      <form
        action={deleteMenuItem}
        onSubmit={(event) => {
          if (!window.confirm("이 메뉴를 삭제할까요?")) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={item.id} />
        <button type="submit" className={`${styles.iconButton} ${styles.iconButtonDanger}`} aria-label="메뉴 삭제">
          <Trash2 size={16} strokeWidth={2.2} />
          메뉴 삭제
        </button>
      </form>

      <div className={styles.optionsSection}>
        <span className={styles.optionsLabel}>추가금 옵션</span>
        {item.menu_item_options.map((option) => (
          <OptionRow key={option.id} option={option} />
        ))}
        <form action={addMenuItemOption}>
          <input type="hidden" name="menuItemId" value={item.id} />
          <button type="submit" className={styles.addButton}>
            <Plus size={14} strokeWidth={2.4} />
            옵션 추가
          </button>
        </form>
      </div>
    </div>
  );
}

function FormButton({
  action,
  hidden,
  disabled,
  label,
  children,
}: {
  action: (formData: FormData) => void;
  hidden: Record<string, string>;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      {Object.entries(hidden).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <button type="submit" className={styles.iconButton} disabled={disabled} aria-label={label}>
        {children}
      </button>
    </form>
  );
}
