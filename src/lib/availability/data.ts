import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type BusinessHour = Database["public"]["Tables"]["business_hours"]["Row"];
export type ClosedDate = Database["public"]["Tables"]["closed_dates"]["Row"];

export const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "18:00";

export async function getBusinessHours(
  supabase: SupabaseClient<Database>,
  storeId: string,
): Promise<BusinessHour[]> {
  const { data, error } = await supabase
    .from("business_hours")
    .select("*")
    .eq("store_id", storeId)
    .order("day_of_week", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const existing = data ?? [];
  const missingDays = [0, 1, 2, 3, 4, 5, 6].filter(
    (day) => !existing.some((row) => row.day_of_week === day),
  );

  if (missingDays.length === 0) {
    return existing;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("business_hours")
    .insert(
      missingDays.map((day) => ({
        store_id: storeId,
        day_of_week: day,
        is_open: day >= 1 && day <= 6,
        start_time: DEFAULT_START_TIME,
        end_time: DEFAULT_END_TIME,
      })),
    )
    .select("*");

  if (insertError) {
    throw new Error(insertError.message);
  }

  return [...existing, ...(inserted ?? [])].sort((a, b) => a.day_of_week - b.day_of_week);
}

export async function getClosedDates(
  supabase: SupabaseClient<Database>,
  storeId: string,
): Promise<ClosedDate[]> {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("closed_dates")
    .select("*")
    .eq("store_id", storeId)
    .gte("closed_date", today)
    .order("closed_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
