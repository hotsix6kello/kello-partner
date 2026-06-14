"use client";

import { Trash2 } from "lucide-react";
import type { MenuItemOption } from "@/lib/menu/data";
import { deleteMenuItemOption, updateMenuItemOption } from "./actions";
import styles from "./menus.module.css";

export default function OptionRow({ option }: { option: MenuItemOption }) {
  return (
    <div className={styles.optionRow}>
      <form action={updateMenuItemOption} className={styles.optionRow} style={{ flex: 1 }}>
        <input type="hidden" name="id" value={option.id} />
        <input
          type="text"
          name="name"
          defaultValue={option.name}
          className={styles.optionNameInput}
          required
        />
        <input
          type="number"
          name="price"
          min={0}
          step={100}
          defaultValue={option.price}
          className={styles.optionPriceInput}
          required
        />
        <button type="submit" className={styles.saveButton}>
          저장
        </button>
      </form>
      <form
        action={deleteMenuItemOption}
        onSubmit={(event) => {
          if (!window.confirm("이 옵션을 삭제할까요?")) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={option.id} />
        <button type="submit" className={`${styles.iconButton} ${styles.iconButtonDanger}`} aria-label="옵션 삭제">
          <Trash2 size={16} strokeWidth={2.2} />
        </button>
      </form>
    </div>
  );
}
