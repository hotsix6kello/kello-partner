import Image from "next/image";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminReviewAccess } from "@/lib/admin/reviews";
import { reviewMenuItem, reviewPhoto } from "./actions";
import styles from "./admin-reviews.module.css";

type PendingMenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_min: number | null;
  price_max: number | null;
  price_type: string;
  duration_min: number;
  stores: { name: string | null } | null;
  categories: { name: string | null } | null;
};

type PendingPhoto = {
  id: string;
  storage_path: string | null;
  slot_type: string;
  slot_index: number;
  stores: { name: string | null } | null;
  categories: { name: string | null } | null;
};

function formatPrice(item: PendingMenuItem) {
  if (item.price_type === "range") {
    return `${item.price_min ?? 0}~${item.price_max ?? 0}원`;
  }

  if (item.price_type === "from") {
    return `${item.price ?? 0}원부터`;
  }

  return `${item.price ?? 0}원`;
}

export default async function AdminReviewsPage() {
  const supabase = await getSupabaseServerClient();
  const access = await getAdminReviewAccess(supabase);

  if (!access.user) {
    return (
      <div className={styles.page}>
        <div className={styles.notice}>관리자 검수 페이지를 보려면 로그인해 주세요.</div>
      </div>
    );
  }

  if (!access.isAdmin) {
    return (
      <div className={styles.page}>
        <div className={styles.notice}>관리자 권한이 필요합니다.</div>
      </div>
    );
  }

  const [{ data: menuItems, error: menuError }, { data: photos, error: photoError }] =
    await Promise.all([
      supabase
        .from("menu_items")
        .select("id, name, description, price, price_min, price_max, price_type, duration_min, stores(name), categories(name)")
        .eq("review_status", "pending")
        .order("updated_at", { ascending: true }),
      supabase
        .from("photos")
        .select("id, storage_path, slot_type, slot_index, stores(name), categories(name)")
        .eq("review_status", "pending")
        .order("updated_at", { ascending: true }),
    ]);

  if (menuError || photoError) {
    console.error("Failed to load review queue", menuError ?? photoError);
    return (
      <div className={styles.page}>
        <div className={styles.notice}>검수 대상을 불러오지 못했습니다.</div>
      </div>
    );
  }

  const pendingMenuItems = (menuItems ?? []) as PendingMenuItem[];
  const pendingPhotos = (photos ?? []) as PendingPhoto[];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>파트너 콘텐츠 검수</h1>
        <p className={styles.description}>
          파트너가 등록하거나 수정한 메뉴와 사진은 승인 전까지 고객 화면에 노출되지 않습니다.
        </p>
      </header>

      <div className={styles.grid}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>메뉴 검수 대기 {pendingMenuItems.length}건</h2>
          <div className={styles.cardList}>
            {pendingMenuItems.length === 0 ? <p className={styles.notice}>검수 대기 메뉴가 없습니다.</p> : null}
            {pendingMenuItems.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.itemTitle}>{item.name}</h3>
                    <p className={styles.meta}>
                      {item.stores?.name || "매장명 없음"} · {item.categories?.name || "카테고리 없음"} ·{" "}
                      {formatPrice(item)} · {item.duration_min}분
                    </p>
                  </div>
                </div>
                {item.description ? <p className={styles.body}>{item.description}</p> : null}
                <ReviewForm id={item.id} action={reviewMenuItem} />
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>사진 검수 대기 {pendingPhotos.length}건</h2>
          <div className={styles.cardList}>
            {pendingPhotos.length === 0 ? <p className={styles.notice}>검수 대기 사진이 없습니다.</p> : null}
            {pendingPhotos.map((photo) => {
              const publicUrl = photo.storage_path
                ? supabase.storage.from("store-photos").getPublicUrl(photo.storage_path).data.publicUrl
                : null;

              return (
                <article key={photo.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div>
                      <h3 className={styles.itemTitle}>
                        {photo.slot_type} #{photo.slot_index}
                      </h3>
                      <p className={styles.meta}>
                        {photo.stores?.name || "매장명 없음"} · {photo.categories?.name || "카테고리 없음"}
                      </p>
                    </div>
                    {publicUrl ? (
                      <Image
                        src={publicUrl}
                        alt=""
                        width={220}
                        height={165}
                        unoptimized
                        className={styles.photoPreview}
                      />
                    ) : null}
                  </div>
                  <ReviewForm id={photo.id} action={reviewPhoto} />
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function ReviewForm({
  id,
  action,
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="id" value={id} />
      <input name="reason" className={styles.reasonInput} placeholder="반려 사유" />
      <button type="submit" name="status" value="approved" className={styles.approveButton}>
        승인
      </button>
      <button type="submit" name="status" value="rejected" className={styles.rejectButton}>
        반려
      </button>
    </form>
  );
}
