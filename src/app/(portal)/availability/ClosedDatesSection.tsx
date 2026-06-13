"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ClosedDate } from "@/lib/availability/data";
import { addClosedDate, deleteClosedDate } from "./actions";
import styles from "./availability.module.css";

function formatClosedDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "UTC",
  });
}

export default function ClosedDatesSection({ closedDates }: { closedDates: ClosedDate[] }) {
  return (
    <div className={styles.closedDatesSection}>
      {closedDates.length === 0 ? (
        <p className={styles.emptyText}>등록된 휴무일이 없습니다.</p>
      ) : (
        <ul className={styles.closedDatesList}>
          {closedDates.map((closedDate) => (
            <li key={closedDate.id} className={styles.closedDateItem}>
              <div>
                <span className={styles.closedDateValue}>{formatClosedDate(closedDate.closed_date)}</span>
                {closedDate.reason ? (
                  <span className={styles.closedDateReason}>{closedDate.reason}</span>
                ) : null}
              </div>
              <form action={deleteClosedDate}>
                <input type="hidden" name="id" value={closedDate.id} />
                <button
                  type="submit"
                  className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                  aria-label="휴무일 삭제"
                >
                  <Trash2 size={16} strokeWidth={2.2} />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={addClosedDate} className={styles.addClosedDateForm}>
        <input type="date" name="closedDate" required className={styles.dateInput} />
        <input type="text" name="reason" placeholder="휴무 사유 (선택)" className={styles.reasonInput} />
        <button type="submit" className={styles.addButton}>
          <Plus size={16} strokeWidth={2.4} />
          휴무일 추가
        </button>
      </form>
    </div>
  );
}
