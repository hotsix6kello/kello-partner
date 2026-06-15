import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { getPartnerAccessForCurrentUser } from "@/lib/partners/access";
import { getPartnerBookings } from "@/lib/partner-bookings/data";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import portalStyles from "../portal.module.css";
import PartnerAccessNotice from "../PartnerAccessNotice";
import styles from "./bookings.module.css";

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
          <h2 className={portalStyles.introTitle}>예약 목록</h2>
          <p className={portalStyles.introText}>
            승인된 파트너만 자기 매장으로 들어온 예약 요청을 확인할 수 있습니다.
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
        <h2 className={portalStyles.introTitle}>예약 목록</h2>
        <p className={portalStyles.introText}>
          고객이 요청한 예약을 확인하는 조회 전용 화면입니다. 예약 확정, 취소, 변경은 다음 단계에서 다룹니다.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={portalStyles.placeholderIcon}>
            <CalendarCheck size={24} strokeWidth={2.1} />
          </span>
          <p className={portalStyles.placeholderText}>아직 이 매장으로 들어온 예약이 없습니다.</p>
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
                  <span className={styles.statusPill}>예약 {displayValue(booking.status)}</span>
                  <span className={styles.statusPill}>결제 {displayValue(booking.payment_status)}</span>
                  <span className={styles.statusPill}>견적 {displayValue(booking.quote_status)}</span>
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
                  <span className={styles.metaLabel}>예약일</span>
                  <span className={styles.metaValue}>{displayValue(booking.booking_date)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>예약시간</span>
                  <span className={styles.metaValue}>{displayValue(booking.booking_time)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>생성일</span>
                  <span className={styles.metaValue}>{formatCreatedAt(booking.created_at)}</span>
                </div>
              </div>

              <Link href={`/bookings/${booking.id}`} className={styles.detailLink}>
                상세 보기
                <ArrowRight size={16} strokeWidth={2.2} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
