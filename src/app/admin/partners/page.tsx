import {
  approvePartner,
  rejectPartner,
  requestPartnerRevision,
  togglePartnerVisibility,
  updatePartnerContractStatus,
} from "./actions";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import styles from "./admin-partners.module.css";

type PartnerRow = Database["public"]["Tables"]["partners"]["Row"];

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

const contractOptions = [
  "not_started",
  "pending",
  "signed",
  "expired",
  "terminated",
] as const;

export default async function AdminPartnersPage() {
  const supabase = await getSupabaseServerClient();

  const { data: partners, error } = await supabase
    .from("partners")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.notice}>파트너 목록을 불러오지 못했습니다.</p>
      </div>
    );
  }

  const rows = partners ?? [];
  const pending = rows.filter((p) => ["pending", "pending_review", "draft", "needs_revision"].includes(p.status));
  const approved = rows.filter((p) => p.status === "approved");
  const rejected = rows.filter((p) => ["rejected", "suspended"].includes(p.status));
  const publicCount = rows.filter((p) => p.is_public ?? p.visibility_status).length;
  const signedCount = rows.filter((p) => p.contract_status === "signed").length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>파트너 관리</h1>
        <p className={styles.description}>
          파트너 승인/반려/보완요청, 계약 상태, 고객 노출, 정산 관리 상태를 분리해서 관리합니다.
        </p>
      </header>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>전체 파트너</span>
          <strong className={styles.summaryValue}>{rows.length}</strong>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>검수/보완</span>
          <strong className={styles.summaryValue}>{pending.length}</strong>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>계약 완료</span>
          <strong className={styles.summaryValue}>{signedCount}</strong>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>고객 노출 ON</span>
          <strong className={styles.summaryValue}>{publicCount}</strong>
        </article>
      </section>

      <PartnerSection title={`검수/보완 대상 ${pending.length}건`} partners={pending} mode="review" />
      <PartnerSection title={`승인 파트너 ${approved.length}건`} partners={approved} mode="approved" />
      <PartnerSection title={`반려/중지 파트너 ${rejected.length}건`} partners={rejected} mode="closed" />
    </div>
  );
}

function PartnerSection({
  title,
  partners,
  mode,
}: {
  title: string;
  partners: PartnerRow[];
  mode: "review" | "approved" | "closed";
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {partners.length === 0 ? (
        <p className={styles.empty}>표시할 파트너가 없습니다.</p>
      ) : (
        <div className={styles.cardList}>
          {partners.map((partner) => (
            <article key={partner.id} className={styles.card}>
              <div className={styles.cardInfo}>
                <strong className={styles.cardName}>{partner.company_name}</strong>
                <span className={styles.cardMeta}>
                  {partner.business_type} · {partner.contact_name} · {partner.phone}
                </span>
                {partner.address ? <span className={styles.cardMeta}>{partner.address}</span> : null}
                <span className={styles.cardMeta}>{partner.email}</span>
                <div className={styles.badgeRow}>
                  <span className={styles.statusBadge}>
                    입점 {partnerStatusLabels[partner.status] ?? partner.status}
                  </span>
                  <span className={styles.statusBadge}>
                    계약 {contractStatusLabels[partner.contract_status ?? "not_started"]}
                  </span>
                  <span className={styles.statusBadge}>
                    고객 노출 {(partner.is_public ?? partner.visibility_status) ? "ON" : "OFF"}
                  </span>
                  <span className={styles.statusBadge}>정산 관리 대기</span>
                </div>
                {partner.reject_reason ? (
                  <span className={styles.rejectReason}>메모: {partner.reject_reason}</span>
                ) : null}
              </div>

              <div className={styles.cardActions}>
                {mode !== "approved" ? (
                  <form action={approvePartner}>
                    <input type="hidden" name="id" value={partner.id} />
                    <button type="submit" className={styles.approveButton}>
                      승인
                    </button>
                  </form>
                ) : null}

                <form action={requestPartnerRevision} className={styles.rejectForm}>
                  <input type="hidden" name="id" value={partner.id} />
                  <input name="reject_reason" className={styles.reasonInput} placeholder="보완 요청 메모" />
                  <button type="submit" className={styles.revisionButton}>
                    보완요청
                  </button>
                </form>

                <form action={rejectPartner} className={styles.rejectForm}>
                  <input type="hidden" name="id" value={partner.id} />
                  <input name="reject_reason" className={styles.reasonInput} placeholder="반려 사유" />
                  <button type="submit" className={styles.rejectButton}>
                    반려
                  </button>
                </form>

                <form action={togglePartnerVisibility}>
                  <input type="hidden" name="id" value={partner.id} />
                  <input type="hidden" name="current_visibility" value={String(partner.is_public ?? partner.visibility_status)} />
                  <button
                    type="submit"
                    className={(partner.is_public ?? partner.visibility_status) ? styles.visibleButton : styles.hiddenButton}
                  >
                    {(partner.is_public ?? partner.visibility_status) ? "노출 ON" : "노출 OFF"}
                  </button>
                </form>

                <form action={updatePartnerContractStatus} className={styles.contractForm}>
                  <input type="hidden" name="id" value={partner.id} />
                  <select
                    name="contract_status"
                    defaultValue={partner.contract_status ?? "not_started"}
                    className={styles.contractSelect}
                  >
                    {contractOptions.map((option) => (
                      <option key={option} value={option}>
                        {contractStatusLabels[option]}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className={styles.contractButton}>
                    계약 저장
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
