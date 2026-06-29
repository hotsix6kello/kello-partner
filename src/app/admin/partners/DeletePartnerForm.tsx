"use client";

import { useActionState, useState } from "react";
import { deletePartner, type DeletePartnerState } from "./actions";
import styles from "./admin-partners.module.css";

const initialState: DeletePartnerState = {
  message: null,
};

export function DeletePartnerForm({
  partnerId,
  companyName,
}: {
  partnerId: number;
  companyName: string;
}) {
  const [confirmation, setConfirmation] = useState("");
  const [state, formAction, isPending] = useActionState(deletePartner, initialState);
  const canDelete = confirmation.trim() === companyName;

  return (
    <form action={formAction} className={styles.deleteForm}>
      <input type="hidden" name="id" value={partnerId} />
      <input
        name="confirmation"
        className={styles.deleteInput}
        placeholder="업체명 입력"
        aria-label={`${companyName} 삭제 확인`}
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
      />
      <button type="submit" className={styles.deleteButton} disabled={!canDelete || isPending}>
        {isPending ? "삭제 중" : "삭제"}
      </button>
      {state.message ? <span className={styles.deleteError}>{state.message}</span> : null}
    </form>
  );
}
