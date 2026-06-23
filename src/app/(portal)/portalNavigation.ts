import {
  Building2,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  House,
  ImagePlus,
  LogIn,
  LogOut,
  ScrollText,
  Store,
  type LucideIcon,
  Tag,
  WalletCards,
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
    description: "입점, 계약, 노출 상태 확인",
    icon: House,
  },
  {
    href: "/partnership",
    label: "제휴 신청/계약",
    description: "입점 신청과 계약 진행 상태",
    icon: ScrollText,
  },
  {
    href: "/store",
    label: "매장 정보",
    description: "홍보용 기본 정보 관리",
    icon: Store,
  },
  {
    href: "/photos",
    label: "사진 관리",
    description: "검수 후 고객 화면 노출",
    icon: ImagePlus,
  },
  {
    href: "/menus",
    label: "메뉴/가격",
    description: "검수 후 고객 화면 노출",
    icon: Tag,
  },
  {
    href: "/availability",
    label: "영업시간/휴무",
    description: "운영 요일과 휴무일 관리",
    icon: CalendarClock,
  },
  {
    href: "/slots",
    label: "예약 가능 시간",
    description: "Kello가 예약 안내에 참고",
    icon: ClipboardList,
  },
  {
    href: "/bookings",
    label: "이용 완료 확인",
    description: "확정 예약 방문/노쇼 확인",
    icon: ClipboardCheck,
  },
  {
    href: "/settlements",
    label: "정산 내역",
    description: "정산 예정과 지급 내역 확인",
    icon: WalletCards,
  },
];

export const adminNavItems: PortalNavItem[] = [
  {
    href: "/admin/partners",
    label: "파트너 관리",
    description: "승인, 계약, 노출, 정산 관리",
    icon: Building2,
  },
  {
    href: "/admin/reviews",
    label: "콘텐츠 검수",
    description: "사진/메뉴 승인 및 반려",
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
