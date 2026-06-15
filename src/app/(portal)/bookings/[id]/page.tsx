import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPartnerAccessForCurrentUser } from "@/lib/partners/access";
import { getPartnerBookingDetail } from "@/lib/partner-bookings/data";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import portalStyles from "../../portal.module.css";
import PartnerAccessNotice from "../../PartnerAccessNotice";
import styles from "../bookings.module.css";

function displayValue(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toLocaleString("ko-KR") : "-";
  }

  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const access = await getPartnerAccessForCurrentUser(supabase);

  if (access.status !== "approved") {
    return (
      <section className={portalStyles.section}>
        <div className={portalStyles.intro}>
          <h2 className={portalStyles.introTitle}>예약 상세</h2>
          <p className={portalStyles.introText}>
            승인된 파트너만 자기 매장의 예약 상세를 확인할 수 있습니다.
          </p>
        </div>

        <PartnerAccessNotice access={access} />
      </section>
    );
  }

  const detail = await getPartnerBookingDetail(supabase, id);

  if (!detail) {
    notFound();
  }

  const { booking, images } = detail;
  const serviceName =
    booking.primary_service_name ?? booking.quote_service_name ?? booking.beauty_category ?? "정보 없음";

  return (
    <section className={portalStyles.section}>
      <div className={styles.detailHeader}>
        <Link href="/bookings" className={styles.backLink}>
          <ArrowLeft size={16} strokeWidth={2.2} />
          예약 목록
        </Link>

        <div className={portalStyles.intro}>
          <h2 className={portalStyles.introTitle}>예약 상세</h2>
          <p className={portalStyles.introText}>
            고객 요청과 결제, 견적 상태를 확인하는 조회 전용 화면입니다.
          </p>
        </div>
      </div>

      <div className={styles.detailGrid}>
        <section className={styles.detailPanel}>
          <h3 className={styles.panelTitle}>예약 기본정보</h3>
          <div className={styles.bookingMetaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>예약일</span>
              <span className={styles.metaValue}>{displayValue(booking.booking_date)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>예약시간</span>
              <span className={styles.metaValue}>{displayValue(booking.booking_time)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>예약 상태</span>
              <span className={styles.metaValue}>{displayValue(booking.status)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>생성일</span>
              <span className={styles.metaValue}>{formatDateTime(booking.created_at)}</span>
            </div>
          </div>
        </section>

        <section className={styles.detailPanel}>
          <h3 className={styles.panelTitle}>고객 정보</h3>
          <div className={styles.bookingMetaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>고객명</span>
              <span className={styles.metaValue}>{displayValue(booking.customer_name)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>이메일</span>
              <span className={styles.metaValue}>{displayValue(booking.customer_email)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>연락처</span>
              <span className={styles.metaValue}>{displayValue(booking.customer_phone)}</span>
            </div>
          </div>
        </section>

        <section className={styles.detailPanel}>
          <h3 className={styles.panelTitle}>서비스/메뉴</h3>
          <div className={styles.bookingMetaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>선택 서비스</span>
              <span className={styles.metaValue}>{displayValue(serviceName)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>추가 옵션</span>
              <span className={styles.metaValue}>
                {booking.add_on_names.length > 0 ? booking.add_on_names.join(", ") : "-"}
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>총액</span>
              <span className={styles.metaValue}>{displayValue(booking.total_price)}원</span>
            </div>
          </div>
        </section>

        <section className={styles.detailPanel}>
          <h3 className={styles.panelTitle}>결제/견적</h3>
          <div className={styles.bookingMetaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>결제 상태</span>
              <span className={styles.metaValue}>{displayValue(booking.payment_status)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>결제 수단</span>
              <span className={styles.metaValue}>{displayValue(booking.payment_method)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>견적 상태</span>
              <span className={styles.metaValue}>{displayValue(booking.quote_status)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>견적 금액</span>
              <span className={styles.metaValue}>{displayValue(booking.quote_total_price)}원</span>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.detailPanel}>
        <h3 className={styles.panelTitle}>고객 요청사항</h3>
        <p className={styles.requestText}>{displayValue(booking.customer_request)}</p>
      </section>

      <section className={styles.detailPanel}>
        <h3 className={styles.panelTitle}>견적 안내 메모</h3>
        <p className={styles.requestText}>{displayValue(booking.quote_note)}</p>
      </section>

      {images.length > 0 ? (
        <section className={styles.detailPanel}>
          <h3 className={styles.panelTitle}>고객 첨부 이미지</h3>
          <div className={styles.imageGrid}>
            {images.map((image) => (
              <figure key={image.id} className={styles.imageTile}>
                <Image
                  src={image.url}
                  alt={image.label}
                  width={360}
                  height={270}
                  className={styles.bookingImage}
                  unoptimized
                />
                <figcaption className={styles.imageCaption}>{image.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
