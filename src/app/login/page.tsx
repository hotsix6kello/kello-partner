import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  ImagePlus,
  MonitorSmartphone,
  Sparkles,
  Tag,
} from "lucide-react";
import styles from "./login.module.css";

const quickHighlights = [
  {
    title: "브랜드 첫인상",
    description: "매장 소개와 운영 진입이 한 화면에서 자연스럽게 이어지도록 구성합니다.",
  },
  {
    title: "운영 흐름 정리",
    description: "사진, 메뉴, 예약 가능 시간으로 이어지는 기본 관리 흐름만 남겨 둡니다.",
  },
  {
    title: "연동 전 스캐폴드",
    description: "Auth, 업로드, CRUD 없이 화면 구조와 톤만 먼저 확정합니다.",
  },
];

const experienceFlow = [
  {
    icon: ImagePlus,
    title: "사진",
    description: "대표 이미지와 시술 컷 구성을 준비합니다.",
  },
  {
    icon: Tag,
    title: "메뉴/가격",
    description: "시술 정보와 가격표 레이아웃을 정리합니다.",
  },
  {
    icon: CalendarClock,
    title: "예약 시간",
    description: "운영 시간과 예약 가능 슬롯 구조를 미리 잡습니다.",
  },
];

const setupNotes = [
  "실제 로그인은 아직 연결하지 않았습니다.",
  "대시보드 버튼은 UI 흐름 확인용입니다.",
  "`.env.local` 값은 로컬에만 두고 Git에는 포함하지 않습니다.",
];

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.heroSurface}>
          <div className={styles.heroGlow} />

          <header className={styles.topbar}>
            <div className={styles.brand}>
              <span className={styles.brandMark}>W</span>
              <div className={styles.brandText}>
                <strong className={styles.brandTitle}>Partner Wekello</strong>
                <span className={styles.brandSubtitle}>partner.wekello.com</span>
              </div>
            </div>

            <span className={styles.topbarBadge}>Homepage-style Preview</span>
          </header>

          <div className={styles.heroGrid}>
            <div className={styles.copyColumn}>
              <span className={styles.eyebrow}>Partner Wekello Preview</span>
              <h1 className={styles.headline}>
                파트너 페이지도 서비스 홈페이지처럼 보이게, 운영 진입은 더 가볍게
              </h1>
              <p className={styles.description}>
                Partner Wekello는 관리 도구를 단순히 나열하지 않고, 매장의 분위기와 운영 흐름이 자연스럽게
                이어지는 홈형 랜딩으로 다시 정리한 파트너 전용 스캐폴드입니다.
              </p>

              <div className={styles.actionRow}>
                <Link href="/dashboard" className={styles.primaryLink}>
                  대시보드 미리보기
                  <ArrowRight size={18} strokeWidth={2.1} />
                </Link>
                <div className={styles.secondaryMeta}>
                  <Sparkles size={16} strokeWidth={2.1} />
                  <span>Supabase/Auth 연결 전 UI 구조만 먼저 확정합니다.</span>
                </div>
              </div>

              <div className={styles.highlightStrip}>
                {quickHighlights.map((item) => (
                  <article key={item.title} className={styles.highlightCard}>
                    <strong className={styles.highlightTitle}>{item.title}</strong>
                    <p className={styles.highlightText}>{item.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className={styles.visualColumn}>
              <div className={styles.previewFrame}>
                <div className={styles.previewHeader}>
                  <span className={styles.previewBadge}>Landing Mood</span>
                  <span className={styles.previewUrl}>partner.wekello.com</span>
                </div>

                <div className={styles.previewHero}>
                  <div className={styles.previewCopy}>
                    <p className={styles.previewEyebrow}>Partner Story</p>
                    <h2 className={styles.previewTitle}>소개와 운영 홈이 한 장면으로 이어지는 파트너 화면</h2>
                    <p className={styles.previewText}>
                      첫 방문자는 서비스 톤을 보고, 운영자는 바로 다음 동선으로 이어질 수 있는 구조를 목표로
                      잡았습니다.
                    </p>
                  </div>

                  <div className={styles.previewMetric}>
                    <span className={styles.metricLabel}>Preview Scope</span>
                    <strong className={styles.metricValue}>4 core views</strong>
                    <span className={styles.metricNote}>dashboard · photos · menus · availability</span>
                  </div>
                </div>

                <div className={styles.flowRail}>
                  {experienceFlow.map(({ icon: Icon, title, description }) => (
                    <article key={title} className={styles.flowItem}>
                      <span className={styles.flowIcon}>
                        <Icon size={20} strokeWidth={2.1} />
                      </span>
                      <div className={styles.flowCopy}>
                        <strong className={styles.flowTitle}>{title}</strong>
                        <p className={styles.flowText}>{description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className={styles.noteBand}>
                {setupNotes.map((note) => (
                  <div key={note} className={styles.noteItem}>
                    <MonitorSmartphone size={16} strokeWidth={2.1} />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className={styles.loginPanel}>
          <div className={styles.loginHeader}>
            <span className={styles.loginBadge}>UI Preview</span>
            <h2 className={styles.loginTitle}>파트너 로그인</h2>
            <p className={styles.loginText}>
              이 단계에서는 실제 인증 대신 로그인 화면과 대시보드 진입 경험만 먼저 정리합니다.
            </p>
          </div>

          <form className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                이메일
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                name="email"
                placeholder="partner@wekello.com"
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                비밀번호
              </label>
              <input
                id="password"
                className={styles.input}
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
              />
            </div>
          </form>

          <div className={styles.helper}>
            로그인 버튼은 현재 인증 없이 대시보드 미리보기로 이동합니다. 세션 유지, 권한 체크, 실제 로그인 처리는
            다음 단계에서 붙이면 됩니다.
          </div>

          <div className={styles.loginActions}>
            <Link href="/dashboard" className={styles.loginPrimary}>
              로그인
            </Link>
            <Link href="/dashboard" className={styles.loginSecondary}>
              대시보드 미리보기
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
