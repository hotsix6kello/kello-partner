import {
  Building2,
  CalendarClock,
  ClipboardList,
  FileCheck2,
  House,
  ImagePlus,
  LogIn,
  LogOut,
  type LucideIcon,
  Tag,
} from "lucide-react";

export type PortalNavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const portalNavItems: PortalNavItem[] = [
  {
    href: "/",
    label: "운영 홈",
    description: "현재 준비 상태와 다음 작업 동선",
    icon: House,
  },
  {
    href: "/photos",
    label: "사진",
    description: "대표 이미지와 시술 컷 구조",
    icon: ImagePlus,
  },
  {
    href: "/menus",
    label: "메뉴/가격",
    description: "시술 항목, 가격, 소요 시간",
    icon: Tag,
  },
  {
    href: "/availability",
    label: "예약 시간",
    description: "운영 시간과 예약 가능 슬롯",
    icon: CalendarClock,
  },
  {
    href: "/bookings",
    label: "예약 목록",
    description: "고객 예약과 상세 확인",
    icon: ClipboardList,
  },
];

export const adminNavItems: PortalNavItem[] = [
  {
    href: "/admin/partners",
    label: "파트너 관리",
    description: "신청 승인·반려·노출 관리",
    icon: Building2,
  },
  {
    href: "/admin/reviews",
    label: "콘텐츠 검수",
    description: "메뉴·사진 승인 및 반려",
    icon: FileCheck2,
  },
];

export const logoutNavItem = {
  label: "로그아웃",
  description: "현재 계정에서 나가기",
  icon: LogOut,
};

export const loginNavItem = {
  href: "/login",
  label: "로그인",
  description: "회원가입 또는 계정 진입",
  icon: LogIn,
};

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getCurrentSection(pathname: string) {
  return (
    [...portalNavItems, ...adminNavItems].find((item) => isActivePath(pathname, item.href)) ??
    portalNavItems[0]
  );
}
