import type { Database } from "@/lib/supabase/database.types";

export type BusinessType = Database["public"]["Enums"]["business_type"];

export const businessTypeOrder: BusinessType[] = [
  "hair",
  "nail",
  "eyelash",
  "makeup",
  "esthetic",
  "waxing",
  "semipermanent",
];

export const businessTypeLabels: Record<BusinessType, string> = {
  hair: "헤어",
  nail: "네일",
  eyelash: "속눈썹",
  makeup: "메이크업",
  esthetic: "에스테틱",
  waxing: "왁싱",
  semipermanent: "반영구",
};

// Initial category seed per business type. These are only a starting point —
// once created, the rows are plain store-owned categories with no further
// link back to the preset.
export const categoryPresets: Record<BusinessType, string[]> = {
  hair: ["컷", "펌", "염색", "클리닉", "스타일링"],
  nail: ["젤네일", "케어", "패디큐어", "아트", "제거"],
  eyelash: ["연장", "리터치", "래쉬펌", "제거"],
  makeup: ["데일리", "웨딩·본식", "행사·촬영", "헤어 추가"],
  esthetic: ["페이셜", "바디", "등·바디 관리", "브라이덜"],
  waxing: ["페이스", "바디", "브라질리언", "부분(겨드랑이 등)"],
  semipermanent: ["눈썹", "아이라인", "입술", "헤어라인"],
};
