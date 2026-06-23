"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOutAction } from "./actions";
import {
  adminNavItems,
  getCurrentSection,
  isActivePath,
  legalNavItems,
  loginNavItem,
  logoutNavItem,
  portalNavItems,
} from "./portalNavigation";
import BrandMark from "./BrandMark";
import styles from "./portal.module.css";

export default function PortalShell({
  children,
  userEmail,
  isAdmin = false,
}: {
  children: React.ReactNode;
  userEmail: string | null;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentSection = getCurrentSection(pathname);
  const isAuthenticated = userEmail !== null;
  const LogoutIcon = logoutNavItem.icon;
  const LoginIcon = loginNavItem.icon;
  const sidebarNavItems = isAdmin ? adminNavItems : portalNavItems;
  const sidebarLabel = isAdmin ? "관리자 메뉴" : "파트너 메뉴";
  const brandHref = isAdmin ? "/admin" : "/";
  const brandSubtitle = isAdmin ? "Kello 운영자 홈" : "파트너 운영 홈";

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
          <Link href={brandHref} className={styles.brand}>
            <BrandMark className={styles.brandMark} />
            <span className={styles.brandCopy}>
              <strong className={styles.brandTitle}>위켈로 파트너</strong>
              <span className={styles.brandSubtitle}>{brandSubtitle}</span>
            </span>
          </Link>

          <span className={styles.navLabel}>{sidebarLabel}</span>

          <nav className={styles.navList}>
            {sidebarNavItems.map((item) => {
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

          <div className={styles.sidebarFooter}>
            {isAuthenticated ? (
              <form action={signOutAction}>
                <button type="submit" className={styles.logoutItem}>
                  <span className={styles.navIcon}>
                    <LogoutIcon size={20} strokeWidth={2.1} />
                  </span>
                  <span className={styles.navCopy}>
                    <strong className={styles.navTitle}>{logoutNavItem.label}</strong>
                    <span className={styles.navDescription}>
                      {userEmail ?? logoutNavItem.description}
                    </span>
                  </span>
                </button>
              </form>
            ) : (
              <Link href={loginNavItem.href} className={styles.logoutItem}>
                <span className={styles.navIcon}>
                  <LoginIcon size={20} strokeWidth={2.1} />
                </span>
                <span className={styles.navCopy}>
                  <strong className={styles.navTitle}>{loginNavItem.label}</strong>
                  <span className={styles.navDescription}>{loginNavItem.description}</span>
                </span>
              </Link>
            )}

            <nav className={styles.legalLinks} aria-label="약관">
              {legalNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.legalLink} ${isActivePath(pathname, item.href) ? styles.legalLinkActive : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
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
              <h1 className={styles.headerTitle}>{currentSection.label}</h1>
            </div>
          </div>

          {isAuthenticated ? (
            <form action={signOutAction}>
              <button type="submit" className={styles.headerAction}>
                로그아웃
              </button>
            </form>
          ) : (
            <Link href={loginNavItem.href} className={styles.headerAction}>
              로그인
            </Link>
          )}
        </header>

        <main className={styles.pageBody}>
          <div className={styles.pageCanvas}>{children}</div>
        </main>
      </div>
    </div>
  );
}
