import Link from "next/link";
import { ArrowRight, CalendarClock, ImagePlus, Tag } from "lucide-react";
import styles from "../portal.module.css";

const cards = [
  {
    href: "/photos",
    title: "사진 관리",
    description: "대표 이미지, 시술 컷, 매장 분위기를 보여주는 비주얼 구성을 먼저 정리합니다.",
    icon: ImagePlus,
  },
  {
    href: "/menus",
    title: "메뉴/가격 관리",
    description: "서비스 이름, 가격, 소요 시간의 기본 레이아웃을 정하고 정보 구조를 맞춥니다.",
    icon: Tag,
  },
  {
    href: "/availability",
    title: "예약 시간 관리",
    description: "운영 시간, 휴무일, 예약 가능 슬롯을 연결할 화면 흐름을 미리 잡아 둡니다.",
    icon: CalendarClock,
  },
];

export default function DashboardPage() {
  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>운영 홈</h2>
        <p className={styles.introText}>
          지금은 실제 데이터 연결 전이므로, Partner Wekello가 어떤 구조로 운영 도구를 보여줄지만 정리한
          프리뷰 상태입니다.
        </p>
      </div>

      <div className={styles.partnerSummary}>
        <div className={styles.partnerSummaryTop}>
          <div className={styles.partnerSummaryCopy}>
            <span className={styles.partnerSummaryEyebrow}>Current Scope</span>
            <h3 className={styles.partnerSummaryTitle}>Partner Wekello UI Scaffold</h3>
          </div>
          <span className={styles.partnerSummaryStatus}>UI only</span>
        </div>
        <p className={styles.partnerSummaryText}>
          사진, 메뉴/가격, 예약 가능 시간 세 가지 운영 흐름만 남기고 다시 시작했습니다. Auth, 업로드, CRUD,
          예약 연동은 아직 포함하지 않았습니다.
        </p>
      </div>

      <div className={styles.dashboardGrid}>
        {cards.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className={styles.dashboardCard}>
            <span className={styles.cardIcon}>
              <Icon size={24} strokeWidth={2.1} />
            </span>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{description}</p>
            </div>
            <span className={styles.cardLink}>
              바로 보기
              <ArrowRight size={18} strokeWidth={2.1} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
