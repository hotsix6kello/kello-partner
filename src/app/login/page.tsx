"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import styles from "./login.module.css";

const entryNotes = [
  "기존 홈 화면은 제거하고 계정 진입 화면만 남겼습니다.",
  "회원가입과 로그인은 모두 Google 계정으로 진행합니다.",
  "Google 인증이 끝나면 운영 홈으로 돌아옵니다.",
];

export default function LoginPage() {
  const [pendingAction, setPendingAction] = useState<"login" | "signup" | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const startGoogleAuth = async (mode: "login" | "signup") => {
    setAuthError(null);
    setPendingAction(mode);

    const supabase = getSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      setPendingAction(null);
      setAuthError("Google 로그인 시작에 실패했습니다. Supabase와 Google 설정을 다시 확인해 주세요.");
    }
  };

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
            홈처럼 보이던 기존 첫 화면은 제거했습니다. 이제 이 페이지에서는 Google 계정으로 로그인 또는
            회원가입만 진행합니다.
          </p>

          <div className={styles.helperBox}>
            {entryNotes.map((note) => (
              <p key={note} className={styles.helperText}>
                {note}
              </p>
            ))}
          </div>

          {authError ? <p className={styles.errorText}>{authError}</p> : null}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={() => void startGoogleAuth("login")}
              disabled={pendingAction !== null}
            >
              {pendingAction === "login" ? "Google 로그인 준비 중..." : "Google로 로그인"}
            </button>
            <button
              type="button"
              className={styles.secondaryAction}
              onClick={() => void startGoogleAuth("signup")}
              disabled={pendingAction !== null}
            >
              {pendingAction === "signup" ? "Google 회원가입 준비 중..." : "회원가입으로 시작"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
