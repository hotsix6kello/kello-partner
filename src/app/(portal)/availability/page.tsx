import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateStore } from "@/lib/store/data";
import { getBusinessHours, getClosedDates } from "@/lib/availability/data";
import portalStyles from "../portal.module.css";
import AvailabilityEditor from "./AvailabilityEditor";

export default async function AvailabilityPage() {
  const supabase = await getSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const store = await getOrCreateStore(supabase, userData.user!.id);
  const [businessHours, closedDates] = await Promise.all([
    getBusinessHours(supabase, store.id),
    getClosedDates(supabase, store.id),
  ]);

  return (
    <section className={portalStyles.section}>
      <div className={portalStyles.intro}>
        <h2 className={portalStyles.introTitle}>예약 시간 관리</h2>
        <p className={portalStyles.introText}>
          요일별 운영 시간과 휴무일을 설정하면 예약 가능한 시간대가 메뉴의 소요 시간과 함께 자동으로
          계산됩니다.
        </p>
      </div>

      <AvailabilityEditor store={store} businessHours={businessHours} closedDates={closedDates} />
    </section>
  );
}
