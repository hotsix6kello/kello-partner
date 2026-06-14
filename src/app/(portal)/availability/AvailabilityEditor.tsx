import type { Store } from "@/lib/store/data";
import type { BusinessHour, ClosedDate } from "@/lib/availability/data";
import ScheduleSettingsForm from "./ScheduleSettingsForm";
import BusinessHoursForm from "./BusinessHoursForm";
import ClosedDatesSection from "./ClosedDatesSection";
import styles from "./availability.module.css";

export default function AvailabilityEditor({
  store,
  businessHours,
  closedDates,
}: {
  store: Store;
  businessHours: BusinessHour[];
  closedDates: ClosedDate[];
}) {
  return (
    <div className={styles.editor}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>예약 설정</h3>
        <p className={styles.cardText}>예약 슬롯 계산에 사용되는 기본 값을 설정하세요.</p>
        <ScheduleSettingsForm store={store} />
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>요일별 운영 시간</h3>
        <p className={styles.cardText}>
          영업하지 않는 요일은 체크를 해제하세요. 휴식 시간은 선택 사항입니다.
        </p>
        <BusinessHoursForm businessHours={businessHours} />
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>휴무일 관리</h3>
        <p className={styles.cardText}>특정 날짜를 휴무로 등록하면 해당 날짜는 예약이 불가능합니다.</p>
        <ClosedDatesSection closedDates={closedDates} />
      </div>
    </div>
  );
}
