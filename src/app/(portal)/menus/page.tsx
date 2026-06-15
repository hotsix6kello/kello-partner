import { Tag } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getPartnerAccessForCurrentUser } from "@/lib/partners/access";
import { getOrCreateStoreForApprovedPartner } from "@/lib/store/data";
import { getCategoriesWithMenuItems } from "@/lib/menu/data";
import portalStyles from "../portal.module.css";
import GuestNotice from "../GuestNotice";
import PartnerAccessNotice from "../PartnerAccessNotice";
import styles from "./menus.module.css";
import MenuEditor from "./MenuEditor";

export default async function MenusPage() {
  const supabase = await getSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return (
      <section className={portalStyles.section}>
        <div className={portalStyles.intro}>
          <h2 className={portalStyles.introTitle}>메뉴/가격 관리</h2>
          <p className={portalStyles.introText}>
            카테고리와 시술 항목을 추가하고, 가격 표기 방식과 소요 시간을 설정하세요. 소요 시간은 예약 슬롯
            계산에 사용되므로 30분 단위로 입력해야 합니다.
          </p>
        </div>

        <GuestNotice description="메뉴와 가격을 등록하고 관리하려면 로그인해주세요." />
      </section>
    );
  }

  const access = await getPartnerAccessForCurrentUser(supabase);

  if (access.status !== "approved") {
    return (
      <section className={portalStyles.section}>
        <PartnerAccessNotice access={access} />
      </section>
    );
  }

  const store = await getOrCreateStoreForApprovedPartner(supabase, access);
  const categories = await getCategoriesWithMenuItems(supabase, store.id);

  return (
    <section className={portalStyles.section}>
      <div className={portalStyles.intro}>
        <h2 className={portalStyles.introTitle}>메뉴/가격 관리</h2>
        <p className={portalStyles.introText}>
          카테고리와 시술 항목을 추가하고, 가격 표기 방식과 소요 시간을 설정하세요. 소요 시간은 예약 슬롯
          계산에 사용되므로 30분 단위로 입력해야 합니다.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={portalStyles.placeholderIcon}>
            <Tag size={24} strokeWidth={2.1} />
          </span>
          <p className={portalStyles.placeholderText}>
            아직 카테고리가 없습니다. 운영 홈에서 업종을 선택하면 기본 카테고리가 생성되며, 아래에서 직접
            추가할 수도 있습니다.
          </p>
        </div>
      ) : null}

      <MenuEditor categories={categories} />
    </section>
  );
}
