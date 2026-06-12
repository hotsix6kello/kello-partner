import Link from "next/link";
import { ArrowRight, CalendarClock, ImagePlus, Tag } from "lucide-react";
import styles from "../portal.module.css";

const cards = [
  {
    href: "/photos",
    title: "사진 관리",
    description: "대표 이미지와 시술 사진을 정리해 매장의 첫인상을 보여주세요.",
    icon: ImagePlus,
  },
  {
    href: "/menus",
    title: "메뉴/가격 관리",
    description: "시술 메뉴, 가격, 소요 시간을 한눈에 보이도록 구성하세요.",
    icon: Tag,
  },
  {
    href: "/availability",
    title: "예약 시간 관리",
    description: "운영 시간과 예약 가능 시간을 고객이 이해하기 쉽게 안내하세요.",
    icon: CalendarClock,
  },
];

export default function DashboardPage() {
  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>파트너 페이지 운영, 핵심 정보부터 간편하게</h2>
        <p className={styles.introText}>
          매장 소개부터 메뉴, 예약 가능 시간까지 파트너 페이지에 필요한 핵심 정보를 한곳에서 관리하세요.
        </p>
      </div>

      <div className={styles.partnerSummary}>
        <div className={styles.partnerSummaryTop}>
          <div className={styles.partnerSummaryCopy}>
            <span className={styles.partnerSummaryEyebrow}>현재 준비 범위</span>
            <h3 className={styles.partnerSummaryTitle}>파트너 페이지 기본 구성</h3>
          </div>
          <span className={styles.partnerSummaryStatus}>화면 설계 단계</span>
        </div>
        <p className={styles.partnerSummaryText}>
          사진, 메뉴/가격, 예약 가능 시간처럼 고객이 가장 먼저 보는 정보부터 정리했습니다. 저장과 연동 기능은
          다음 단계에서 연결됩니다.
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
              관리하기
              <ArrowRight size={18} strokeWidth={2.1} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
