import Link from "next/link";
import { LogIn } from "lucide-react";
import styles from "./portal.module.css";

export default function GuestNotice({
  title = "로그인이 필요합니다",
  description = "이 기능을 사용하려면 로그인해주세요.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className={styles.guestNotice}>
      <span className={styles.placeholderIcon}>
        <LogIn size={24} strokeWidth={2.1} />
      </span>
      <div className={styles.guestNoticeCopy}>
        <h3 className={styles.guestNoticeTitle}>{title}</h3>
        <p className={styles.guestNoticeText}>{description}</p>
      </div>
      <Link href="/login" className={styles.guestNoticeButton}>
        로그인 하기
      </Link>
    </div>
  );
}
