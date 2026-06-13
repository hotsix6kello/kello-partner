"use client";

import type { Store } from "@/lib/store/data";
import { updateScheduleSettings } from "./actions";
import styles from "./availability.module.css";

export default function ScheduleSettingsForm({ store }: { store: Store }) {
  return (
    <form action={updateScheduleSettings} className={styles.settingsForm}>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>동시 수용 인원</label>
        <input
          type="number"
          name="capacity"
          min={1}
          step={1}
          defaultValue={store.capacity}
          className={styles.fieldInput}
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>예약 마감(시간 전)</label>
        <input
          type="number"
          name="leadTimeHours"
          min={0}
          step={1}
          defaultValue={store.lead_time_hours}
          className={styles.fieldInput}
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>예약 슬롯 간격(분)</label>
        <input
          type="number"
          name="slotIntervalMinutes"
          min={5}
          step={5}
          defaultValue={store.slot_interval_minutes}
          className={styles.fieldInput}
          required
        />
      </div>

      <button type="submit" className={styles.saveButton}>
        저장
      </button>
    </form>
  );
}
