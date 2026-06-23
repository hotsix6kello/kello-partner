import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import styles from "./admin-home.module.css";

type CountResult = {
  count: number | null;
  error: { message: string } | null;
};

function getCount(result: CountResult) {
  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.count ?? 0;
}

export default async function AdminHomePage() {
  const supabase = await getSupabaseServerClient();

  try {
    const [
      pendingPartners,
      contractPendingPartners,
      pendingMenuItems,
      pendingPhotos,
      publicPartners,
      revisionPartners,
    ] = await Promise.all([
      supabase
        .from("partners")
        .select("id", { count: "exact", head: true })
        .in("status", ["pending", "pending_review"]),
      supabase
        .from("partners")
        .select("id", { count: "exact", head: true })
        .in("contract_status", ["not_started", "pending"]),
      supabase
        .from("menu_items")
        .select("id", { count: "exact", head: true })
        .eq("review_status", "pending"),
      supabase
        .from("photos")
        .select("id", { count: "exact", head: true })
        .eq("review_status", "pending"),
      supabase
        .from("partners")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved")
        .eq("contract_status", "signed")
        .eq("is_public", true),
      supabase
        .from("partners")
        .select("id", { count: "exact", head: true })
        .eq("status", "needs_revision"),
    ]);

    const pendingContentCount = getCount(pendingMenuItems) + getCount(pendingPhotos);
    const summaryCards = [
      {
        label: "승인 대기 파트너",
        value: getCount(pendingPartners),
        description: "신규 제휴 신청 검토가 필요한 파트너",
      },
      {
        label: "계약 대기 파트너",
        value: getCount(contractPendingPartners),
        description: "계약 시작 전이거나 계약 진행 중인 파트너",
      },
      {
        label: "콘텐츠 검수 대기",
        value: pendingContentCount,
        description: "승인 전 사진과 메뉴/가격 콘텐츠",
      },
      {
        label: "노출 중 매장",
        value: getCount(publicPartners),
        description: "승인, 계약 완료, 고객 노출 ON 상태",
      },
      {
        label: "보완 요청 파트너",
        value: getCount(revisionPartners),
        description: "운영팀 보완 요청 후 재제출 대기",
      },
    ];

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>관리자 홈</h1>
          <p className={styles.description}>
            Kello 운영자가 오늘 확인해야 할 파트너 승인, 계약, 콘텐츠 검수, 고객 노출 상태를
            요약합니다.
          </p>
        </header>

        <section className={styles.summaryGrid} aria-label="오늘 처리해야 할 요약">
          {summaryCards.map((card) => (
            <article key={card.label} className={styles.summaryCard}>
              <span className={styles.summaryLabel}>{card.label}</span>
              <strong className={styles.summaryValue}>{card.value}</strong>
              <span className={styles.summaryDescription}>{card.description}</span>
            </article>
          ))}
        </section>

        <section className={styles.shortcutGrid} aria-label="관리자 빠른 이동">
          <Link href="/admin/partners" className={styles.shortcutCard}>
            <strong className={styles.shortcutTitle}>파트너 관리</strong>
            <span className={styles.shortcutText}>
              승인, 반려, 보완 요청, 계약 상태, 고객 노출 ON/OFF를 처리합니다.
            </span>
          </Link>
          <Link href="/admin/reviews" className={styles.shortcutCard}>
            <strong className={styles.shortcutTitle}>콘텐츠 검수</strong>
            <span className={styles.shortcutText}>
              파트너가 등록한 사진과 메뉴/가격을 승인하거나 반려합니다.
            </span>
          </Link>
        </section>
      </div>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "관리자 요약을 불러오지 못했습니다.";

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>관리자 홈</h1>
        </header>
        <p className={styles.notice}>{message}</p>
      </div>
    );
  }
}
