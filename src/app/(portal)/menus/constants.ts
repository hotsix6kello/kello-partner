import type { Database } from "@/lib/supabase/database.types";

export const priceTypeLabels: Record<Database["public"]["Enums"]["price_type"], string> = {
  fixed: "정액",
  from: "~부터",
  range: "범위",
};

export const reviewStatusLabels: Record<Database["public"]["Enums"]["review_status"], string> = {
  pending: "검수 대기",
  approved: "승인됨",
  rejected: "반려됨",
};

// 30-minute increments, up to 6 hours.
export const durationOptions = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];
