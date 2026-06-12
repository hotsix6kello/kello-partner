"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCurrentSection, isActivePath, logoutNavItem, portalNavItems } from "./portalNavigation";
import styles from "./portal.module.css";

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentSection = getCurrentSection(pathname);
  const LogoutIcon = logoutNavItem.icon;

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen || typeof window === "undefined" || window.innerWidth >= 1100) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const releaseScrollLock = () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleResize = () => {
      if (window.innerWidth >= 1100) {
        releaseScrollLock();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      releaseScrollLock();
    };
  }, [sidebarOpen]);

  return (
    <div className={styles.shell}>
      <button
        type="button"
        className={`${styles.sidebarBackdrop} ${sidebarOpen ? styles.sidebarBackdropVisible : ""}`}
        aria-label="사이드바 닫기"
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarPanel}>
          <Link href="/dashboard" className={styles.brand}>
            <span className={styles.brandMark}>W</span>
            <span className={styles.brandCopy}>
              <strong className={styles.brandTitle}>Partner Wekello</strong>
              <span className={styles.brandSubtitle}>파트너 운영 미리보기</span>
            </span>
          </Link>

          <span className={styles.navLabel}>Quick Access</span>

          <nav className={styles.navList}>
            {portalNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                >
                  <span className={styles.navIcon}>
                    <Icon size={20} strokeWidth={active ? 2.4 : 2.1} />
                  </span>
                  <span className={styles.navCopy}>
                    <strong className={styles.navTitle}>{item.label}</strong>
                    <span className={styles.navDescription}>{item.description}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <Link href={logoutNavItem.href} className={styles.logoutItem}>
            <span className={styles.navIcon}>
              <LogoutIcon size={20} strokeWidth={2.1} />
            </span>
            <span className={styles.navCopy}>
              <strong className={styles.navTitle}>{logoutNavItem.label}</strong>
              <span className={styles.navDescription}>{logoutNavItem.description}</span>
            </span>
          </Link>
        </div>
      </aside>

      <div className={styles.contentColumn}>
        <header className={styles.header}>
          <div className={styles.headerLead}>
            <button
              type="button"
              className={styles.mobileMenuButton}
              aria-label="사이드바 열기"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} strokeWidth={2.2} />
            </button>
            <div className={styles.headerCopy}>
              <span className={styles.headerEyebrow}>Partner Wekello</span>
              <h1 className={styles.headerTitle}>{currentSection.label}</h1>
            </div>
          </div>

          <div className={styles.headerBadge}>UI Preview</div>
        </header>

        <main className={styles.pageBody}>
          <div className={styles.pageCanvas}>{children}</div>
        </main>
      </div>
    </div>
  );
}
