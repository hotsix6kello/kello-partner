import { CalendarClock } from "lucide-react";
import styles from "../portal.module.css";

export default function AvailabilityPage() {
  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>예약 시간 관리</h2>
        <p className={styles.introText}>
          운영 시간과 예약 가능 슬롯을 어떤 관리자 경험으로 다룰지 설계하는 스캐폴드입니다.
        </p>
      </div>

      <div className={styles.placeholderPanel}>
        <div className={styles.placeholderTop}>
          <span className={styles.placeholderBadge}>준비 중</span>
          <div className={styles.placeholderTitleRow}>
            <span className={styles.placeholderIcon}>
              <CalendarClock size={24} strokeWidth={2.1} />
            </span>
            <h3 className={styles.placeholderTitle}>예약 가능 시간 화면 스캐폴드</h3>
          </div>
          <p className={styles.placeholderText}>
            아직 실제 예약 데이터와 연결하지 않았습니다. 대신 요일별 운영 시간, 휴무일, 예약 슬롯 배치를 어떤
            흐름으로 편집할지 화면 뼈대만 먼저 정리합니다.
          </p>
        </div>

        <div className={styles.placeholderGrid}>
          <div className={styles.placeholderCard}>
            <strong className={styles.placeholderCardTitle}>기본 운영 시간</strong>
            <p className={styles.placeholderCardText}>
              요일별 오픈/마감 시간대를 정리할 수 있도록 기본 테이블 구조를 가정합니다.
            </p>
          </div>
          <div className={styles.placeholderCard}>
            <strong className={styles.placeholderCardTitle}>휴무일 관리</strong>
            <p className={styles.placeholderCardText}>
              정기 휴무와 특정 날짜 휴무를 분리해 다룰 수 있는 상태 구성을 염두에 둡니다.
            </p>
          </div>
          <div className={styles.placeholderCard}>
            <strong className={styles.placeholderCardTitle}>예약 슬롯</strong>
            <p className={styles.placeholderCardText}>
              추후 시술별 간격과 가능 시간대를 연결할 수 있도록 슬롯 개념만 선반영합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
