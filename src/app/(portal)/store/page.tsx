import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPartnerAccessForCurrentUser } from "@/lib/partners/access";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import PartnerAccessNotice from "../PartnerAccessNotice";
import styles from "../portal.module.css";

export default async function StoreInfoPage() {
  const supabase = await getSupabaseServerClient();
  const access = await getPartnerAccessForCurrentUser(supabase);

  if (access.status !== "approved") {
    return (
      <section className={styles.section}>
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>매장 정보</h2>
          <p className={styles.introText}>승인된 파트너만 고객 화면에 사용할 매장 홍보정보를 관리할 수 있습니다.</p>
        </div>
        <PartnerAccessNotice access={access} />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>매장 정보</h2>
        <p className={styles.introText}>
          현재 매장 기본정보 입력은 운영 홈에서 관리합니다. 저장된 정보는 관리자 검수와 고객 노출 설정을 거친 뒤 반영됩니다.
        </p>
      </div>
      <Link href="/" className={styles.guestNoticeButton}>
        운영 홈에서 수정하기
        <ArrowRight size={16} strokeWidth={2.2} />
      </Link>
    </section>
  );
}
