import { Tag } from "lucide-react";
import styles from "../portal.module.css";

export default function MenusPage() {
  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>메뉴/가격 관리</h2>
        <p className={styles.introText}>
          시술 항목, 가격, 소요 시간을 어떤 구조로 보여줄지 정리하는 단계입니다.
        </p>
      </div>

      <div className={styles.placeholderPanel}>
        <div className={styles.placeholderTop}>
          <span className={styles.placeholderBadge}>준비 중</span>
          <div className={styles.placeholderTitleRow}>
            <span className={styles.placeholderIcon}>
              <Tag size={24} strokeWidth={2.1} />
            </span>
            <h3 className={styles.placeholderTitle}>메뉴 편집 화면 스캐폴드</h3>
          </div>
          <p className={styles.placeholderText}>
            저장 기능을 바로 붙이기보다, 파트너가 가장 자주 만질 정보인 메뉴명, 가격, 소요 시간을 보기 좋은 순서로
            배치하는 데 초점을 맞춘 프리뷰입니다.
          </p>
        </div>

        <div className={styles.placeholderGrid}>
          <div className={styles.placeholderCard}>
            <strong className={styles.placeholderCardTitle}>카테고리 구성</strong>
            <p className={styles.placeholderCardText}>
              헤어, 네일, 속눈썹 등 서비스 분류별로 메뉴를 나누는 기본 레이아웃입니다.
            </p>
          </div>
          <div className={styles.placeholderCard}>
            <strong className={styles.placeholderCardTitle}>가격/시간 정보</strong>
            <p className={styles.placeholderCardText}>
              금액과 예상 소요 시간을 나란히 정리해 예약 전환에 필요한 핵심 정보만 먼저 보여줍니다.
            </p>
          </div>
          <div className={styles.placeholderCard}>
            <strong className={styles.placeholderCardTitle}>설명 문구</strong>
            <p className={styles.placeholderCardText}>
              추천 포인트, 관리 팁, 시술 설명 같은 보조 카피를 붙일 자리도 함께 남겨 둡니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
