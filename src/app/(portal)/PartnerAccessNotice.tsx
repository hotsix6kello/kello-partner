import { Clock3, ShieldAlert, ShieldCheck } from "lucide-react";
import type { PartnerAccess } from "@/lib/partners/access";
import GuestNotice from "./GuestNotice";
import PartnerApplyForm from "./PartnerApplyForm";
import styles from "./portal.module.css";

const copyByStatus: Record<
  Exclude<PartnerAccess["status"], "approved" | "not_authenticated">,
  { title: string; description: string; icon: typeof ShieldCheck }
> = {
  no_partner: {
    title: "승인된 파트너 계정이 필요합니다.",
    description: "매장 관리 페이지는 관리자에게 승인된 파트너 계정만 사용할 수 있습니다.",
    icon: ShieldCheck,
  },
  pending: {
    title: "파트너 신청이 검토 중입니다.",
    description: "관리자 승인 후 매장 정보, 사진, 메뉴, 예약 가능 시간을 관리할 수 있습니다.",
    icon: Clock3,
  },
  rejected: {
    title: "파트너 신청이 반려되었습니다.",
    description: "관리자에게 문의해 주세요.",
    icon: ShieldAlert,
  },
};

export default function PartnerAccessNotice({ access }: { access: PartnerAccess }) {
  if (access.status === "not_authenticated") {
    return <GuestNotice description="매장 관리 페이지를 사용하려면 로그인해 주세요." />;
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
      {access.status === "rejected" && (
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
