import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { getPartnerAccessForCurrentUser } from "@/lib/partners/access";
import { getPartnerBookings } from "@/lib/partner-bookings/data";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import portalStyles from "../portal.module.css";
import PartnerAccessNotice from "../PartnerAccessNotice";
import { updatePartnerVisitStatus } from "./actions";
import styles from "./bookings.module.css";

const visitStatusLabels: Record<string, string> = {
  completed: "방문 완료 확인됨",
  no_show: "노쇼 확인됨",
};

function displayValue(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
}

function displayCustomer(name: string | null | undefined, email: string | null | undefined) {
  return displayValue(name) !== "-" ? displayValue(name) : displayValue(email);
}

function displayService(primary: string | null | undefined, quoted: string | null | undefined) {
  return displayValue(primary) !== "-" ? displayValue(primary) : displayValue(quoted);
}

function formatCreatedAt(createdAt: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));
}

export default async function BookingsPage() {
  const supabase = await getSupabaseServerClient();
  const access = await getPartnerAccessForCurrentUser(supabase);

  if (access.status !== "approved") {
    return (
      <section className={portalStyles.section}>
        <div className={portalStyles.intro}>
          <h2 className={portalStyles.introTitle}>이용 완료 확인</h2>
          <p className={portalStyles.introText}>
            승인된 파트너만 Kello가 확정한 방문 건의 완료/노쇼 여부를 확인할 수 있습니다.
          </p>
        </div>

        <PartnerAccessNotice access={access} />
      </section>
    );
  }

  const { bookings } = await getPartnerBookings(supabase);

  return (
    <section className={portalStyles.section}>
      <div className={portalStyles.intro}>
        <h2 className={portalStyles.introTitle}>이용 완료 확인</h2>
        <p className={portalStyles.introText}>
          고객 예약 요청, 확정, 변경, 취소 처리는 Kello 메인 어드민에서만 진행합니다. 이 화면에서는 Kello가 확정한
          방문 건에 대해 실제 방문 완료 또는 노쇼 여부만 확인합니다.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={portalStyles.placeholderIcon}>
            <ClipboardCheck size={24} strokeWidth={2.1} />
          </span>
          <p className={portalStyles.placeholderText}>아직 확인할 확정 방문 건이 없습니다.</p>
        </div>
      ) : (
        <div className={styles.bookingList}>
          {bookings.map((booking) => (
            <article key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingCardHeader}>
                <div className={styles.bookingTitleGroup}>
                  <span className={styles.bookingEyebrow}>
                    {booking.booking_date} {booking.booking_time}
                  </span>
                  <h3 className={styles.bookingTitle}>
                    {displayService(booking.primary_service_name, booking.quote_service_name)}
                  </h3>
                </div>
                <div className={styles.statusGroup}>
                  <span className={styles.statusPill}>Kello 확정 {displayValue(booking.status)}</span>
                  <span className={styles.statusPill}>결제 {displayValue(booking.payment_status)}</span>
                  <span className={styles.statusPill}>
                    방문 {visitStatusLabels[booking.partner_visit_status ?? ""] ?? "확인 대기"}
                  </span>
                </div>
              </div>

              <div className={styles.bookingMetaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>고객</span>
                  <span className={styles.metaValue}>
                    {displayCustomer(booking.customer_name, booking.customer_email)}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>이용일</span>
                  <span className={styles.metaValue}>{displayValue(booking.booking_date)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>이용 시간</span>
                  <span className={styles.metaValue}>{displayValue(booking.booking_time)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>생성일</span>
                  <span className={styles.metaValue}>{formatCreatedAt(booking.created_at)}</span>
                </div>
              </div>

              <div className={styles.visitActions}>
                <form action={updatePartnerVisitStatus}>
                  <input type="hidden" name="booking_id" value={booking.id} />
                  <input type="hidden" name="partner_visit_status" value="completed" />
                  <button type="submit" className={styles.completeButton}>
                    방문 완료
                  </button>
                </form>
                <form action={updatePartnerVisitStatus}>
                  <input type="hidden" name="booking_id" value={booking.id} />
                  <input type="hidden" name="partner_visit_status" value="no_show" />
                  <button type="submit" className={styles.noShowButton}>
                    노쇼
                  </button>
                </form>
                <Link href={`/bookings/${booking.id}`} className={styles.detailLink}>
                  상세 확인
                  <ArrowRight size={16} strokeWidth={2.2} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
