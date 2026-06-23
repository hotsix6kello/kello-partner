import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarClock, FileCheck2, ImagePlus, Store, Tag, WalletCards } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getPartnerAccessForCurrentUser } from "@/lib/partners/access";
import { getOrCreateStoreForApprovedPartner } from "@/lib/store/data";
import { businessTypeLabels, businessTypeOrder } from "@/lib/menu/presets";
import styles from "./portal.module.css";
import GuestNotice from "./GuestNotice";
import PartnerAccessNotice from "./PartnerAccessNotice";
import { updateStoreBusinessTypes, updateStoreProfile } from "./dashboard/actions";

type StatusTone = "neutral" | "good" | "warn" | "danger";

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

const reviewStatusLabels: Record<string, string> = {
  pending: "검수 대기",
  approved: "승인 완료",
  rejected: "반려",
};

const statusToneByReviewStatus: Record<string, StatusTone> = {
  pending: "warn",
  approved: "good",
  rejected: "danger",
};

const managementCards = [
  {
    href: "/partnership",
    title: "제휴 신청/계약",
    description: "입점 신청 상태와 계약 진행 상태를 확인합니다.",
    icon: FileCheck2,
  },
  {
    href: "/store",
    title: "매장 정보",
    description: "고객 화면에 사용할 매장 소개와 연락처를 관리합니다.",
    icon: Store,
  },
  {
    href: "/photos",
    title: "사진 관리",
    description: "대표 이미지와 시술 사진을 등록하고 검수 상태를 확인합니다.",
    icon: ImagePlus,
  },
  {
    href: "/menus",
    title: "메뉴/가격",
    description: "시술 항목, 가격, 소요 시간을 등록하고 검수 상태를 확인합니다.",
    icon: Tag,
  },
  {
    href: "/availability",
    title: "영업시간/휴무",
    description: "요일별 영업시간과 휴무일을 관리합니다.",
    icon: CalendarClock,
  },
  {
    href: "/settlements",
    title: "정산 내역",
    description: "정산 예정 금액과 지급 상태를 확인합니다.",
    icon: WalletCards,
  },
];

function getToneClass(tone: StatusTone) {
  switch (tone) {
    case "good":
      return styles.statusCardGood;
    case "warn":
      return styles.statusCardWarn;
    case "danger":
      return styles.statusCardDanger;
    default:
      return styles.statusCardNeutral;
  }
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return (
      <section className={styles.section}>
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>파트너 포털 운영 홈</h2>
          <p className={styles.introText}>
            파트너 포털은 예약 처리용이 아니라 제휴 신청, 계약, 매장 홍보정보, 영업정보, 정산 확인을 관리하는 공간입니다.
          </p>
        </div>

        <GuestNotice description="제휴 신청과 매장 정보를 관리하려면 로그인해 주세요." />
      </section>
    );
  }

  const { data: profile } = await supabase
    .from("partner_profiles")
    .select("is_admin")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profile?.is_admin) {
    redirect("/admin");
  }

  const access = await getPartnerAccessForCurrentUser(supabase);

  if (access.status !== "approved") {
    return (
      <section className={styles.section}>
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>파트너 포털 운영 홈</h2>
          <p className={styles.introText}>
            승인 전에는 매장과 콘텐츠가 고객 화면에 노출되지 않습니다. Kello 승인 후 매장 홍보정보와 영업정보를 관리할 수 있습니다.
          </p>
        </div>
        <PartnerAccessNotice access={access} />
      </section>
    );
  }

  const store = await getOrCreateStoreForApprovedPartner(supabase, access);
  const [{ count: pendingMenuCount }, { count: pendingPhotoCount }] = await Promise.all([
    supabase
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("store_id", store.id)
      .neq("review_status", "approved"),
    supabase
      .from("photos")
      .select("id", { count: "exact", head: true })
      .eq("store_id", store.id)
      .neq("review_status", "approved"),
  ]);

  const partner = access.partner;
  const contractStatus = partner.contract_status ?? "not_started";
  const isPublic = partner.is_public ?? partner.visibility_status;
  const contentIssueCount = (pendingMenuCount ?? 0) + (pendingPhotoCount ?? 0);
  const selectedTypes = new Set(store.business_types);

  const statusCards = [
    {
      label: "입점 상태",
      value: partnerStatusLabels[partner.status] ?? partner.status,
      detail: "파트너 계정 승인 기준",
      tone: partner.status === "approved" ? "good" : "warn",
    },
    {
      label: "계약 상태",
      value: contractStatusLabels[contractStatus] ?? contractStatus,
      detail: "정식 계약 및 갱신 상태",
      tone: contractStatus === "signed" ? "good" : contractStatus === "terminated" ? "danger" : "warn",
    },
    {
      label: "고객 노출 상태",
      value: isPublic ? "노출 ON" : "노출 OFF",
      detail: "Kello 어드민에서만 변경",
      tone: isPublic ? "good" : "neutral",
    },
    {
      label: "콘텐츠 검수 상태",
      value: contentIssueCount > 0 ? `${contentIssueCount}건 검수 필요` : reviewStatusLabels[store.review_status] ?? store.review_status,
      detail: "사진/메뉴/가격은 승인 후 노출",
      tone: contentIssueCount > 0 ? "warn" : statusToneByReviewStatus[store.review_status] ?? "neutral",
    },
    {
      label: "정산 대기 금액",
      value: "0원",
      detail: "정산 데이터 연동 전",
      tone: "neutral",
    },
  ] satisfies { label: string; value: string; detail: string; tone: StatusTone }[];

  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>파트너 포털 운영 홈</h2>
        <p className={styles.introText}>
          예약 요청 처리는 Kello 메인 어드민에서 진행합니다. 이 포털에서는 제휴 상태, 계약, 매장 홍보정보, 영업정보,
          정산 확인을 관리합니다.
        </p>
      </div>

      <div className={styles.statusCardGrid}>
        {statusCards.map((card) => (
          <article key={card.label} className={`${styles.statusCard} ${getToneClass(card.tone)}`}>
            <span className={styles.statusCardLabel}>{card.label}</span>
            <strong className={styles.statusCardValue}>{card.value}</strong>
            <span className={styles.statusCardDetail}>{card.detail}</span>
          </article>
        ))}
      </div>

      <div className={styles.partnerSummary}>
        <div className={styles.partnerSummaryTop}>
          <div className={styles.partnerSummaryCopy}>
            <span className={styles.partnerSummaryEyebrow}>매장 정보</span>
            <h3 className={styles.partnerSummaryTitle}>고객 화면에 사용할 매장 홍보정보를 관리합니다.</h3>
          </div>
        </div>
        <p className={styles.partnerSummaryText}>
          파트너가 저장한 정보는 Kello 관리자 검수와 고객 노출 설정을 거친 뒤 고객 화면에 반영됩니다.
        </p>

        <form action={updateStoreProfile} className={styles.storeProfileForm}>
          <div className={styles.storeProfileGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>상호명</label>
              <input type="text" name="name" defaultValue={store.name} className={styles.fieldInput} required />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>연락처</label>
              <input type="tel" name="phone" defaultValue={store.phone} className={styles.fieldInput} />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>주소</label>
              <input type="text" name="address" defaultValue={store.address} className={styles.fieldInput} />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>매장 소개</label>
            <textarea
              name="description"
              defaultValue={store.description}
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
            <span className={styles.partnerSummaryEyebrow}>영업 분야</span>
            <h3 className={styles.partnerSummaryTitle}>운영 중인 업종을 선택해 주세요.</h3>
          </div>
          <span className={styles.partnerSummaryStatus}>
            {selectedTypes.size > 0 ? `${selectedTypes.size}개 선택됨` : "선택 필요"}
          </span>
        </div>

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

      <div className={styles.dashboardGrid}>
        {managementCards.map(({ href, title, description, icon: Icon }) => (
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
