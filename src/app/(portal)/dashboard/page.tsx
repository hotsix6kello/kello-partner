import Link from "next/link";
import { ArrowRight, CalendarClock, ImagePlus, Tag } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getPartnerAccessForCurrentUser } from "@/lib/partners/access";
import { getOrCreateStoreForApprovedPartner } from "@/lib/store/data";
import { businessTypeLabels, businessTypeOrder } from "@/lib/menu/presets";
import styles from "../portal.module.css";
import GuestNotice from "../GuestNotice";
import PartnerAccessNotice from "../PartnerAccessNotice";
import { setStorePublished, updateStoreBusinessTypes, updateStoreProfile } from "./actions";

const reviewStatusMeta: Record<string, { label: string; className: string }> = {
  pending: { label: "검수 대기", className: styles.reviewBadgePending },
  approved: { label: "승인됨 · 노출 중", className: styles.reviewBadgeApproved },
  rejected: { label: "반려됨", className: styles.reviewBadgeRejected },
};

const cards = [
  {
    href: "/photos",
    title: "사진 관리",
    description: "대표 이미지와 시술 사진을 정리해 매장의 첫인상을 보여주세요.",
    icon: ImagePlus,
  },
  {
    href: "/menus",
    title: "메뉴/가격 관리",
    description: "시술 메뉴, 가격, 소요 시간을 한눈에 보이도록 구성하세요.",
    icon: Tag,
  },
  {
    href: "/availability",
    title: "예약 시간 관리",
    description: "운영 시간과 예약 가능 시간을 고객이 이해하기 쉽게 안내하세요.",
    icon: CalendarClock,
  },
];

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return (
      <section className={styles.section}>
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>파트너 페이지 운영, 핵심 정보부터 간편하게</h2>
          <p className={styles.introText}>
            매장 소개부터 메뉴, 예약 가능 시간까지 파트너 페이지에 필요한 핵심 정보를 한곳에서 관리하세요.
          </p>
        </div>

        <GuestNotice description="매장 정보를 등록하고 관리하려면 로그인해주세요." />

        <div className={styles.dashboardGrid}>
          {cards.map(({ href, title, description, icon: Icon }) => (
            <Link key={href} href={href} className={styles.dashboardCard}>
              <span className={styles.cardIcon}>
                <Icon size={24} strokeWidth={2.1} />
              </span>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardText}>{description}</p>
              </div>
              <span className={styles.cardLink}>
                둘러보기
                <ArrowRight size={18} strokeWidth={2.1} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  const access = await getPartnerAccessForCurrentUser(supabase);

  if (access.status !== "approved") {
    return (
      <section className={styles.section}>
        <PartnerAccessNotice access={access} />
      </section>
    );
  }

  const store = await getOrCreateStoreForApprovedPartner(supabase, access);
  const selectedTypes = new Set(store.business_types);
  const reviewMeta = reviewStatusMeta[store.review_status] ?? {
    label: store.review_status,
    className: styles.reviewBadgePending,
  };
  const hasCoordinates = store.latitude != null && store.longitude != null;

  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>파트너 페이지 운영, 핵심 정보부터 간편하게</h2>
        <p className={styles.introText}>
          매장 소개부터 메뉴, 예약 가능 시간까지 파트너 페이지에 필요한 핵심 정보를 한곳에서 관리하세요.
        </p>
      </div>

      <div className={styles.partnerSummary}>
        <div className={styles.partnerSummaryTop}>
          <div className={styles.partnerSummaryCopy}>
            <span className={styles.partnerSummaryEyebrow}>매장 기본정보</span>
            <h3 className={styles.partnerSummaryTitle}>고객에게 보여질 매장 정보를 입력하세요</h3>
          </div>
        </div>
        <p className={styles.partnerSummaryText}>
          상호명, 소개, 연락처, 주소는 파트너 페이지의 매장 정보 영역에 표시됩니다.
        </p>

        <form action={updateStoreProfile} className={styles.storeProfileForm}>
          <div className={styles.storeProfileGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>상호명</label>
              <input
                type="text"
                name="name"
                defaultValue={store.name}
                placeholder="매장 이름을 입력하세요"
                className={styles.fieldInput}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>연락처</label>
              <input
                type="tel"
                name="phone"
                defaultValue={store.phone}
                placeholder="예) 02-1234-5678"
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>주소</label>
              <input
                type="text"
                name="address"
                defaultValue={store.address}
                placeholder="매장 주소를 입력하세요"
                className={styles.fieldInput}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>매장 소개</label>
            <textarea
              name="description"
              defaultValue={store.description}
              placeholder="매장의 특징이나 분위기를 소개해주세요"
              className={styles.fieldTextarea}
              rows={3}
            />
          </div>

          <button type="submit" className={styles.businessTypeSubmit}>
            매장 정보 저장
          </button>
        </form>
      </div>

      <div className={styles.partnerSummary}>
        <div className={styles.partnerSummaryTop}>
          <div className={styles.partnerSummaryCopy}>
            <span className={styles.partnerSummaryEyebrow}>운영 업종</span>
            <h3 className={styles.partnerSummaryTitle}>업종을 선택하면 기본 메뉴 카테고리가 생성됩니다</h3>
          </div>
          <span className={styles.partnerSummaryStatus}>
            {selectedTypes.size > 0 ? `${selectedTypes.size}개 선택됨` : "선택 필요"}
          </span>
        </div>
        <p className={styles.partnerSummaryText}>
          여러 업종을 동시에 운영한다면 모두 선택할 수 있습니다. 새로 선택한 업종의 기본 카테고리는
          메뉴/가격 화면에 자동으로 추가되며, 이미 있는 카테고리는 중복으로 추가되지 않습니다.
        </p>

        <form action={updateStoreBusinessTypes} className={styles.businessTypeForm}>
          <div className={styles.businessTypeGrid}>
            {businessTypeOrder.map((type) => (
              <label key={type} className={styles.businessTypeOption}>
                <input
                  type="checkbox"
                  name="businessTypes"
                  value={type}
                  defaultChecked={selectedTypes.has(type)}
                  className={styles.businessTypeCheckbox}
                />
                {businessTypeLabels[type]}
              </label>
            ))}
          </div>
          <button type="submit" className={styles.businessTypeSubmit}>
            업종 저장
          </button>
        </form>
      </div>

      <div className={styles.partnerSummary}>
        <div className={styles.partnerSummaryTop}>
          <div className={styles.partnerSummaryCopy}>
            <span className={styles.partnerSummaryEyebrow}>켈로 고객앱 노출</span>
            <h3 className={styles.partnerSummaryTitle}>고객앱 공개 설정</h3>
          </div>
          <span className={`${styles.reviewBadge} ${reviewMeta.className}`}>{reviewMeta.label}</span>
        </div>
        <p className={styles.partnerSummaryText}>
          공개를 켜도 운영팀 승인(approved) 전에는 켈로 고객앱에 노출되지 않습니다.
        </p>

        {store.review_status !== "approved" && store.review_reason ? (
          <p className={styles.reviewReason}>검수 의견: {store.review_reason}</p>
        ) : null}

        {!hasCoordinates ? (
          <p className={styles.coordinateHint}>주소를 저장하면 지도 노출이 활성화됩니다.</p>
        ) : null}

        <form action={setStorePublished} className={styles.publishToggleForm}>
          <input type="hidden" name="published" value={(!store.published).toString()} />
          <button type="submit" className={styles.publishToggle} aria-pressed={store.published}>
            <span className={styles.publishToggleTrack}>
              <span className={styles.publishToggleThumb} />
            </span>
            <span className={styles.publishToggleLabel}>
              {store.published ? "켈로 고객앱에 공개 중" : "켈로 고객앱에 비공개"}
            </span>
          </button>
        </form>
      </div>

      <div className={styles.dashboardGrid}>
        {cards.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className={styles.dashboardCard}>
            <span className={styles.cardIcon}>
              <Icon size={24} strokeWidth={2.1} />
            </span>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{description}</p>
            </div>
            <span className={styles.cardLink}>
              관리하기
              <ArrowRight size={18} strokeWidth={2.1} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
