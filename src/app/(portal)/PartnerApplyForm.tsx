"use client";

import { useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";
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

  const close = () => {
    setOpen(false);
    setError(null);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

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

  return (
    <>
      <button type="button" className={styles.guestNoticeButton} onClick={() => setOpen(true)}>
        {mode === "reapply" ? "재신청하기" : "파트너 신청하기"}
      </button>

      {open && (
        <div className={styles.modalBackdrop} onClick={close}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>파트너 신청</p>
                <h2 className={styles.modalTitle}>
                  {mode === "reapply" ? "파트너 재신청" : "파트너 등록 신청"}
                </h2>
              </div>
              <button type="button" className={styles.modalClose} onClick={close} aria-label="닫기">
                <X size={20} strokeWidth={2.2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
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
                    autoFocus
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
                    <option value="" disabled>카테고리 선택</option>
                    {businessTypeOrder.map((type) => (
                      <option key={type} value={type}>
                        {businessTypeLabels[type]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    매장번호 <span className={styles.applyFormRequired}>*</span>
                  </label>
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
                <button type="button" onClick={close} className={styles.applyFormCancel}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
