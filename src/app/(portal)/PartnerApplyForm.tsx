"use client";

import { useState, useTransition } from "react";
import { businessTypeLabels, businessTypeOrder } from "@/lib/menu/presets";
import type { Partner } from "@/lib/partners/access";
import { applyForPartner } from "./partnerApplyAction";
import styles from "./portal.module.css";

type Prefill = Pick<Partner, "company_name" | "business_type" | "address" | "phone" | "contact_name">;

export default function PartnerApplyForm({
  mode,
  prefill,
}: {
  mode: "apply" | "reapply";
  prefill?: Prefill;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        await applyForPartner(formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "신청 중 오류가 발생했습니다.");
      }
    });
  };

  if (!open) {
    return (
      <button type="button" className={styles.guestNoticeButton} onClick={() => setOpen(true)}>
        {mode === "reapply" ? "재신청하기" : "파트너 신청하기"}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.applyForm}>
      <div className={styles.applyFormGrid}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            업체명 <span className={styles.applyFormRequired}>*</span>
          </label>
          <input
            type="text"
            name="company_name"
            defaultValue={prefill?.company_name ?? ""}
            placeholder="매장 또는 업체 이름"
            className={styles.fieldInput}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            업체카테고리 <span className={styles.applyFormRequired}>*</span>
          </label>
          <select
            name="business_type"
            defaultValue={prefill?.business_type ?? ""}
            className={styles.fieldInput}
            required
          >
            <option value="" disabled>
              카테고리 선택
            </option>
            {businessTypeOrder.map((type) => (
              <option key={type} value={type}>
                {businessTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>매장번호 <span className={styles.applyFormRequired}>*</span></label>
          <input
            type="tel"
            name="phone"
            defaultValue={prefill?.phone ?? ""}
            placeholder="예) 02-1234-5678"
            className={styles.fieldInput}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            대표 성함 <span className={styles.applyFormRequired}>*</span>
          </label>
          <input
            type="text"
            name="contact_name"
            defaultValue={prefill?.contact_name ?? ""}
            placeholder="대표자 이름"
            className={styles.fieldInput}
            required
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>매장주소</label>
        <input
          type="text"
          name="address"
          defaultValue={prefill?.address ?? ""}
          placeholder="매장 주소를 입력하세요"
          className={styles.fieldInput}
        />
      </div>

      {error ? <p className={styles.applyFormError}>{error}</p> : null}

      <div className={styles.applyFormActions}>
        <button type="submit" disabled={isPending} className={styles.businessTypeSubmit}>
          {isPending ? "신청 중..." : "신청서 제출"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className={styles.applyFormCancel}
        >
          취소
        </button>
      </div>
    </form>
  );
}
