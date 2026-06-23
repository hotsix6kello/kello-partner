import { getPartnerAccessForCurrentUser } from "@/lib/partners/access";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import PartnerAccessNotice from "../PartnerAccessNotice";
import styles from "../portal.module.css";

export default async function SettlementsPage() {
  const supabase = await getSupabaseServerClient();
  const access = await getPartnerAccessForCurrentUser(supabase);

  if (access.status !== "approved") {
    return (
      <section className={styles.section}>
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>정산 내역</h2>
          <p className={styles.introText}>
            승인된 파트너만 정산 예정 금액과 지급 내역을 확인할 수 있습니다.
          </p>
        </div>
        <PartnerAccessNotice access={access} />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>정산 내역</h2>
        <p className={styles.introText}>
          고객 예약 처리와 결제 확정은 Kello 메인 어드민에서 진행합니다. 정산 데이터 연동 후
          이 화면에서 정산 예정, 보류, 지급 완료 상태를 확인할 수 있습니다.
        </p>
      </div>

      <div className={styles.guestNotice}>
        <div className={styles.guestNoticeCopy}>
          <strong className={styles.guestNoticeTitle}>아직 정산 내역이 없습니다.</strong>
          <p className={styles.guestNoticeText}>
            방문 완료 및 정산 확인 후 이곳에 표시됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
