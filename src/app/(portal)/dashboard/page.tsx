import Link from "next/link";
import { ArrowRight, CalendarClock, ImagePlus, Tag } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateStore } from "@/lib/store/data";
import { businessTypeLabels, businessTypeOrder } from "@/lib/menu/presets";
import styles from "../portal.module.css";
import { updateStoreBusinessTypes } from "./actions";

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
  const store = await getOrCreateStore(supabase, userData.user!.id);
  const selectedTypes = new Set(store.business_types);

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
