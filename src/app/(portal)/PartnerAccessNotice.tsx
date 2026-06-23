import { Clock3, ShieldAlert, ShieldCheck, Wrench } from "lucide-react";
import type { PartnerAccess } from "@/lib/partners/access";
import GuestNotice from "./GuestNotice";
import PartnerApplyForm from "./PartnerApplyForm";
import styles from "./portal.module.css";

const copyByStatus: Record<
  Exclude<PartnerAccess["status"], "approved" | "not_authenticated">,
  { title: string; description: string; icon: typeof ShieldCheck }
> = {
  no_partner: {
    title: "제휴 신청이 필요합니다.",
    description:
      "파트너 포털은 제휴 신청, 계약, 매장 홍보정보, 영업정보, 정산 확인을 위한 공간입니다. 신청 후 Kello 승인 절차가 진행됩니다.",
    icon: ShieldCheck,
  },
  draft: {
    title: "제휴 신청 작성 중입니다.",
    description: "필수 서류와 매장 정보를 보완한 뒤 검수를 요청해 주세요.",
    icon: Wrench,
  },
  pending_review: {
    title: "제휴 신청 검수 중입니다.",
    description:
      "Kello가 사업자 정보와 영업 가능 여부를 확인하고 있습니다. 승인 전에는 고객 화면에 노출되지 않습니다.",
    icon: Clock3,
  },
  needs_revision: {
    title: "보완 요청이 있습니다.",
    description: "Kello가 요청한 사업자 정보, 영업신고증, 매장 정보를 보완한 뒤 다시 검수를 요청해 주세요.",
    icon: Wrench,
  },
  rejected: {
    title: "제휴 신청이 반려되었습니다.",
    description: "반려 사유를 확인한 뒤 필요한 정보를 보완해 다시 신청할 수 있습니다.",
    icon: ShieldAlert,
  },
  suspended: {
    title: "파트너 이용이 일시 중지되었습니다.",
    description: "계약, 운영정책, 콘텐츠 검수 또는 정산 이슈로 이용이 제한된 상태입니다. Kello 운영팀에 문의해 주세요.",
    icon: ShieldAlert,
  },
};

export default function PartnerAccessNotice({ access }: { access: PartnerAccess }) {
  if (access.status === "not_authenticated") {
    return <GuestNotice description="파트너 포털을 사용하려면 로그인해 주세요." />;
  }

  if (access.status === "approved") {
    return null;
  }

  const copy = copyByStatus[access.status];
  const Icon = copy.icon;

  return (
    <div className={styles.guestNotice}>
      <span className={styles.placeholderIcon}>
        <Icon size={24} strokeWidth={2.1} />
      </span>
      <div className={styles.guestNoticeCopy}>
        <h3 className={styles.guestNoticeTitle}>{copy.title}</h3>
        <p className={styles.guestNoticeText}>{copy.description}</p>
      </div>
      {access.status === "no_partner" && <PartnerApplyForm mode="apply" />}
      {(access.status === "rejected" ||
        access.status === "needs_revision" ||
        access.status === "draft") && (
        <PartnerApplyForm
          mode="reapply"
          prefill={{
            company_name: access.partner.company_name,
            business_type: access.partner.business_type,
            address: access.partner.address ?? "",
            phone: access.partner.phone,
            contact_name: access.partner.contact_name,
          }}
        />
      )}
    </div>
  );
}
