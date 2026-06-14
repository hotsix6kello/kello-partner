"use client";

import { useState } from "react";
import { DAY_LABELS, type BusinessHour } from "@/lib/availability/data";
import { updateBusinessHours } from "./actions";
import styles from "./availability.module.css";

type RowState = { isOpen: boolean; hasBreak: boolean };

export default function BusinessHoursForm({ businessHours }: { businessHours: BusinessHour[] }) {
  const [rows, setRows] = useState<RowState[]>(() =>
    businessHours.map((hour) => ({
      isOpen: hour.is_open,
      hasBreak: Boolean(hour.break_start_time && hour.break_end_time),
    })),
  );

  function updateRow(index: number, patch: Partial<RowState>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <form action={updateBusinessHours} className={styles.hoursForm}>
      <div className={styles.hoursList}>
        {businessHours.map((hour, index) => {
          const row = rows[index];

          return (
            <div key={hour.day_of_week} className={styles.hoursRow}>
              <div className={styles.dayLabelGroup}>
                <input
                  type="checkbox"
                  id={`isOpen-${hour.day_of_week}`}
                  name={`isOpen-${hour.day_of_week}`}
                  defaultChecked={hour.is_open}
                  onChange={(event) => updateRow(index, { isOpen: event.target.checked })}
                  className={styles.dayCheckbox}
                />
                <label htmlFor={`isOpen-${hour.day_of_week}`} className={styles.dayLabel}>
                  {DAY_LABELS[hour.day_of_week]}
                </label>
              </div>

              <div className={styles.timeFields}>
                <input
                  type="time"
                  name={`startTime-${hour.day_of_week}`}
                  defaultValue={hour.start_time?.slice(0, 5) ?? "09:00"}
                  disabled={!row.isOpen}
                  className={styles.timeInput}
                />
                <span className={styles.timeSeparator}>~</span>
                <input
                  type="time"
                  name={`endTime-${hour.day_of_week}`}
                  defaultValue={hour.end_time?.slice(0, 5) ?? "18:00"}
                  disabled={!row.isOpen}
                  className={styles.timeInput}
                />
              </div>

              <div className={styles.breakFields}>
                <label className={styles.breakToggle}>
                  <input
                    type="checkbox"
                    name={`hasBreak-${hour.day_of_week}`}
                    defaultChecked={row.hasBreak}
                    disabled={!row.isOpen}
                    onChange={(event) => updateRow(index, { hasBreak: event.target.checked })}
                  />
                  휴식시간
                </label>
                <input
                  type="time"
                  name={`breakStart-${hour.day_of_week}`}
                  defaultValue={hour.break_start_time?.slice(0, 5) ?? "12:00"}
                  disabled={!row.isOpen || !row.hasBreak}
                  className={styles.timeInput}
                />
                <span className={styles.timeSeparator}>~</span>
                <input
                  type="time"
                  name={`breakEnd-${hour.day_of_week}`}
                  defaultValue={hour.break_end_time?.slice(0, 5) ?? "13:00"}
                  disabled={!row.isOpen || !row.hasBreak}
                  className={styles.timeInput}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button type="submit" className={styles.saveButton}>
        운영 시간 저장
      </button>
    </form>
  );
}
