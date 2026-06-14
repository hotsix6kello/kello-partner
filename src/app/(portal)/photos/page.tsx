import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateStore } from "@/lib/store/data";
import { getCategoryOptions } from "@/lib/menu/data";
import { getPhotoSlots } from "@/lib/photos/data";
import portalStyles from "../portal.module.css";
import GuestNotice from "../GuestNotice";
import PhotoEditor from "./PhotoEditor";

export default async function PhotosPage() {
  const supabase = await getSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return (
      <section className={portalStyles.section}>
        <div className={portalStyles.intro}>
          <h2 className={portalStyles.introTitle}>사진 관리</h2>
          <p className={portalStyles.introText}>
            대표 이미지, 매장 인테리어, 시술 갤러리 사진을 슬롯별로 업로드하고 관리하세요. 업로드한 사진은
            검수 후 노출됩니다.
          </p>
        </div>

        <GuestNotice description="사진을 업로드하고 관리하려면 로그인해주세요." />
      </section>
    );
  }

  const store = await getOrCreateStore(supabase, userData.user.id);
  const [slots, categories] = await Promise.all([
    getPhotoSlots(supabase, store.id),
    getCategoryOptions(supabase, store.id),
  ]);

  const photoUrls: Record<string, string> = {};
  for (const slot of slots) {
    if (slot.photo?.storage_path) {
      photoUrls[slot.photo.id] = supabase.storage
        .from("store-photos")
        .getPublicUrl(slot.photo.storage_path).data.publicUrl;
    }
  }

  return (
    <section className={portalStyles.section}>
      <div className={portalStyles.intro}>
        <h2 className={portalStyles.introTitle}>사진 관리</h2>
        <p className={portalStyles.introText}>
          대표 이미지, 매장 인테리어, 시술 갤러리 사진을 슬롯별로 업로드하고 관리하세요. 업로드한 사진은
          검수 후 노출됩니다.
        </p>
      </div>

      <PhotoEditor slots={slots} photoUrls={photoUrls} categories={categories} />
    </section>
  );
}
