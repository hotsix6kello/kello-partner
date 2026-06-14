"use client";

import { Plus } from "lucide-react";
import type { Category } from "@/lib/menu/data";
import { createCategory } from "./actions";
import CategoryCard from "./CategoryCard";
import styles from "./menus.module.css";

export default function MenuEditor({ categories }: { categories: Category[] }) {
  return (
    <div className={styles.categoryList}>
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          isFirst={index === 0}
          isLast={index === categories.length - 1}
        />
      ))}

      <form action={createCategory} className={styles.addCategoryForm}>
        <input type="text" name="name" placeholder="새 카테고리 이름" className={styles.addInput} />
        <button type="submit" className={styles.addButton}>
          <Plus size={16} strokeWidth={2.4} />
          카테고리 추가
        </button>
      </form>
    </div>
  );
}
