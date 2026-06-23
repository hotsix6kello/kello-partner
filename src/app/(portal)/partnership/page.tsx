import { getPartnerAccessForCurrentUser } from "@/lib/partners/access";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import PartnerAccessNotice from "../PartnerAccessNotice";
import styles from "../portal.module.css";

const partnerStatusLabels: Record<string, string> = {
  draft: "작성 중",
  pending: "검수 대기",
  pending_review: "검수 대기",
  needs_revision: "보완 요청",
  approved: "승인 완료",
  rejected: "반려",
  suspended: "이용 중지",
};

const contractStatusLabels: Record<string, string> = {
  not_started: "계약 전",
  pending: "계약 진행 중",
  signed: "계약 완료",
  expired: "계약 만료",
  terminated: "계약 종료",
};

export default async function PartnershipPage() {
  const supabase = await getSupabaseServerClient();
  const access = await getPartnerAccessForCurrentUser(supabase);

  if (access.status !== "approved") {
    return (
      <section className={styles.section}>
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>제휴 신청/계약</h2>
          <p className={styles.introText}>
            제휴 신청 후 Kello가 사업자등록증, 영업신고증, 영업 가능 여부를 확인하고 계약 단계로 진행합니다.
          </p>
        </div>
        <PartnerAccessNotice access={access} />
      </section>
    );
  }

  const contractStatus = access.partner.contract_status ?? "not_started";

  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>제휴 신청/계약</h2>
        <p className={styles.introText}>
          파트너 승인과 계약 상태를 확인합니다. 계약서 작성과 상태 변경은 Kello 어드민에서 관리합니다.
        </p>
      </div>

      <div className={styles.statusCardGrid}>
        <article className={`${styles.statusCard} ${styles.statusCardGood}`}>
          <span className={styles.statusCardLabel}>입점 상태</span>
          <strong className={styles.statusCardValue}>
            {partnerStatusLabels[access.partner.status] ?? access.partner.status}
          </strong>
          <span className={styles.statusCardDetail}>Kello 심사 기준 상태</span>
        </article>
        <article className={`${styles.statusCard} ${styles.statusCardNeutral}`}>
          <span className={styles.statusCardLabel}>계약 상태</span>
          <strong className={styles.statusCardValue}>
            {contractStatusLabels[contractStatus] ?? contractStatus}
          </strong>
          <span className={styles.statusCardDetail}>정식 계약 및 갱신 상태</span>
        </article>
      </div>
    </section>
  );
}
