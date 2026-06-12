import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./login.module.css";

const entryNotes = [
  "기존 홈 화면은 제거하고 계정 진입 화면만 남겼습니다.",
  "실제 로그인과 회원가입 로직은 아직 연결하지 않았습니다.",
  "현재 버튼은 화면 흐름 확인용으로 대시보드로 이동합니다.",
];

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>위</span>
            <div className={styles.brandText}>
              <strong className={styles.brandTitle}>위켈로 파트너</strong>
              <span className={styles.brandSubtitle}>파트너 계정 진입</span>
            </div>
          </div>

          <Link href="/dashboard" className={styles.backLink}>
            <ArrowLeft size={16} strokeWidth={2.1} />
            운영 홈으로 돌아가기
          </Link>
        </header>

        <section className={styles.surface}>
          <span className={styles.badge}>로그인 / 회원가입</span>
          <h1 className={styles.title}>파트너 계정으로 시작하기</h1>
          <p className={styles.description}>
            홈처럼 보이던 기존 첫 화면은 제거했습니다. 이제 이 페이지에서 로그인 또는 회원가입 진입만 처리하도록
            단순하게 가져갑니다.
          </p>

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

          <div className={styles.helperBox}>
            {entryNotes.map((note) => (
              <p key={note} className={styles.helperText}>
                {note}
              </p>
            ))}
          </div>

          <div className={styles.actions}>
            <Link href="/dashboard" className={styles.primaryAction}>
              로그인
              <ArrowRight size={18} strokeWidth={2.1} />
            </Link>
            <Link href="/dashboard" className={styles.secondaryAction}>
              회원가입으로 시작
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
