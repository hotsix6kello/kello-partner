import { getSupabaseServerClient } from "@/lib/supabase/server";
import { approvePartner, rejectPartner, togglePartnerVisibility } from "./actions";
import styles from "./admin-partners.module.css";

export default async function AdminPartnersPage() {
  const supabase = await getSupabaseServerClient();

  const { data: partners, error } = await supabase
    .from("partners")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className={styles.page}><p className={styles.notice}>파트너 목록을 불러오지 못했습니다.</p></div>;
  }

  const pending = (partners ?? []).filter((p) => p.status?.toLowerCase() === "pending");
  const approved = (partners ?? []).filter((p) => p.status?.toLowerCase() === "approved");
  const rejected = (partners ?? []).filter((p) => p.status?.toLowerCase() === "rejected");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>파트너 관리</h1>
        <p className={styles.description}>파트너 신청을 승인·반려하고 고객 앱 노출 여부를 설정합니다.</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>신청 대기 {pending.length}건</h2>
        {pending.length === 0 ? (
          <p className={styles.empty}>대기 중인 신청이 없습니다.</p>
        ) : (
          <div className={styles.cardList}>
            {pending.map((p) => (
              <article key={p.id} className={styles.card}>
                <div className={styles.cardInfo}>
                  <strong className={styles.cardName}>{p.company_name}</strong>
                  <span className={styles.cardMeta}>{p.business_type} · {p.contact_name} · {p.phone}</span>
                  {p.address ? <span className={styles.cardMeta}>{p.address}</span> : null}
                  <span className={styles.cardMeta}>{p.email}</span>
                </div>
                <div className={styles.cardActions}>
                  <form action={approvePartner}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className={styles.approveButton}>승인</button>
                  </form>
                  <form action={rejectPartner} className={styles.rejectForm}>
                    <input type="hidden" name="id" value={p.id} />
                    <input name="reject_reason" className={styles.reasonInput} placeholder="반려 사유 (선택)" />
                    <button type="submit" className={styles.rejectButton}>반려</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>승인된 파트너 {approved.length}명</h2>
        {approved.length === 0 ? (
          <p className={styles.empty}>승인된 파트너가 없습니다.</p>
        ) : (
          <div className={styles.cardList}>
            {approved.map((p) => (
              <article key={p.id} className={styles.card}>
                <div className={styles.cardInfo}>
                  <strong className={styles.cardName}>{p.company_name}</strong>
                  <span className={styles.cardMeta}>{p.business_type} · {p.contact_name} · {p.phone}</span>
                  {p.address ? <span className={styles.cardMeta}>{p.address}</span> : null}
                  <span className={styles.cardMeta}>{p.email}</span>
                </div>
                <div className={styles.cardActions}>
                  <form action={togglePartnerVisibility}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="current_visibility" value={String(p.visibility_status)} />
                    <button
                      type="submit"
                      className={p.visibility_status ? styles.visibleButton : styles.hiddenButton}
                    >
                      {p.visibility_status ? "노출중" : "숨김"}
                    </button>
                  </form>
                  <form action={rejectPartner} className={styles.rejectForm}>
                    <input type="hidden" name="id" value={p.id} />
                    <input name="reject_reason" className={styles.reasonInput} placeholder="반려 사유 (선택)" />
                    <button type="submit" className={styles.rejectButton}>반려</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>반려된 파트너 {rejected.length}명</h2>
        {rejected.length === 0 ? (
          <p className={styles.empty}>반려된 파트너가 없습니다.</p>
        ) : (
          <div className={styles.cardList}>
            {rejected.map((p) => (
              <article key={p.id} className={styles.card}>
                <div className={styles.cardInfo}>
                  <strong className={styles.cardName}>{p.company_name}</strong>
                  <span className={styles.cardMeta}>{p.business_type} · {p.contact_name} · {p.phone}</span>
                  <span className={styles.cardMeta}>{p.email}</span>
                  {p.reject_reason ? (
                    <span className={styles.rejectReason}>반려 사유: {p.reject_reason}</span>
                  ) : null}
                </div>
                <div className={styles.cardActions}>
                  <form action={approvePartner}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className={styles.approveButton}>재승인</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
