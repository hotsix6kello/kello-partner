"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { Category } from "@/lib/menu/data";
import { createMenuItem, deleteCategory, moveCategory, renameCategory } from "./actions";
import MenuItemCard from "./MenuItemCard";
import styles from "./menus.module.css";

export default function CategoryCard({
  category,
  isFirst,
  isLast,
}: {
  category: Category;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className={styles.categoryCard}>
      <div className={styles.categoryHeader}>
        <form action={renameCategory} className={styles.categoryNameForm}>
          <input type="hidden" name="categoryId" value={category.id} />
          <input
            type="text"
            name="name"
            defaultValue={category.name}
            className={styles.categoryNameInput}
            required
          />
          <button type="submit" className={styles.saveButton}>
            저장
          </button>
        </form>

        <div className={styles.categoryActions}>
          <form action={moveCategory}>
            <input type="hidden" name="categoryId" value={category.id} />
            <input type="hidden" name="direction" value="up" />
            <button type="submit" className={styles.iconButton} disabled={isFirst} aria-label="카테고리 위로 이동">
              <ArrowUp size={16} strokeWidth={2.2} />
            </button>
          </form>
          <form action={moveCategory}>
            <input type="hidden" name="categoryId" value={category.id} />
            <input type="hidden" name="direction" value="down" />
            <button type="submit" className={styles.iconButton} disabled={isLast} aria-label="카테고리 아래로 이동">
              <ArrowDown size={16} strokeWidth={2.2} />
            </button>
          </form>
          <form
            action={deleteCategory}
            onSubmit={(event) => {
              if (!window.confirm("카테고리와 포함된 메뉴를 모두 삭제할까요?")) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="categoryId" value={category.id} />
            <button
              type="submit"
              className={`${styles.iconButton} ${styles.iconButtonDanger}`}
              aria-label="카테고리 삭제"
            >
              <Trash2 size={16} strokeWidth={2.2} />
            </button>
          </form>
        </div>
      </div>

      <div className={styles.menuItemList}>
        {category.menu_items.length === 0 ? (
          <p className={styles.fieldLabel}>아직 메뉴가 없습니다. 아래에서 메뉴를 추가해 주세요.</p>
        ) : null}
        {category.menu_items.map((item, index) => (
          <MenuItemCard
            key={item.id}
            item={item}
            categoryId={category.id}
            isFirst={index === 0}
            isLast={index === category.menu_items.length - 1}
          />
        ))}
      </div>

      <form action={createMenuItem}>
        <input type="hidden" name="categoryId" value={category.id} />
        <button type="submit" className={styles.addButton}>
          <Plus size={16} strokeWidth={2.4} />
          메뉴 추가
        </button>
      </form>
    </div>
  );
}
