import { ImagePlus } from "lucide-react";
import styles from "../portal.module.css";

export default function PhotosPage() {
  return (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>사진 관리</h2>
        <p className={styles.introText}>
          대표 이미지와 시술 비주얼을 어떤 순서로 보여줄지 먼저 설계하는 스캐폴드 화면입니다.
        </p>
      </div>

      <div className={styles.placeholderPanel}>
        <div className={styles.placeholderTop}>
          <span className={styles.placeholderBadge}>준비 중</span>
          <div className={styles.placeholderTitleRow}>
            <span className={styles.placeholderIcon}>
              <ImagePlus size={24} strokeWidth={2.1} />
            </span>
            <h3 className={styles.placeholderTitle}>사진 업로드/정렬 화면 스캐폴드</h3>
          </div>
          <p className={styles.placeholderText}>
            실제 업로드와 저장은 아직 연결하지 않았습니다. 대신 파트너가 어떤 종류의 이미지를 어떤 순서로
            정리하게 될지 화면 흐름만 먼저 맞춰 둡니다.
          </p>
        </div>

        <div className={styles.placeholderGrid}>
          <div className={styles.placeholderCard}>
            <strong className={styles.placeholderCardTitle}>대표 이미지</strong>
            <p className={styles.placeholderCardText}>
              매장 첫인상을 결정하는 메인 비주얼과 썸네일 구성을 관리하는 자리입니다.
            </p>
          </div>
          <div className={styles.placeholderCard}>
            <strong className={styles.placeholderCardTitle}>시술 갤러리</strong>
            <p className={styles.placeholderCardText}>
              헤어, 네일, 속눈썹처럼 카테고리별 시술 이미지를 묶어서 보여줄 수 있게 준비합니다.
            </p>
          </div>
          <div className={styles.placeholderCard}>
            <strong className={styles.placeholderCardTitle}>검수 상태</strong>
            <p className={styles.placeholderCardText}>
              추후 업로드 검수, 노출 여부, 정렬 순서를 붙일 수 있도록 카드 구조만 남겨 둡니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
