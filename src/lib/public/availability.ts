import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type AvailabilitySlot = {
  time: string;
  available: boolean;
  reason?: "break_time" | "lead_time" | "fully_booked";
};

export type AvailabilityResult =
  | {
      ok: true;
      date: string;
      storeId: string;
      menuItemId: string;
      slots: AvailabilitySlot[];
      closed: boolean;
    }
  | {
      ok: false;
      status: 400 | 404;
      error: string;
    };

type StoreScheduleSettings = Pick<
  Database["public"]["Tables"]["stores"]["Row"],
  "id" | "capacity" | "lead_time_hours" | "slot_interval_minutes"
>;
type BusinessHour = Database["public"]["Tables"]["business_hours"]["Row"];
type MenuItem = Pick<
  Database["public"]["Tables"]["menu_items"]["Row"],
  "id" | "store_id" | "duration_min" | "visible" | "review_status"
>;
type BookingRow = Pick<
  Database["public"]["Tables"]["beauty_booking_requests"]["Row"],
  "booking_time" | "status"
>;

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "18:00";
const DEFAULT_SLOT_INTERVAL_MINUTES = 30;
const DEFAULT_LEAD_TIME_HOURS = 2;
const DEFAULT_CAPACITY = 1;
const DEFAULT_DURATION_MINUTES = 60;
const CANCELED_STATUSES = new Set(["canceled", "cancelled", "cancel", "취소", "취소됨"]);

function isValidDateString(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(`${date}T00:00:00`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.getFullYear() === year &&
    parsed.getMonth() + 1 === month &&
    parsed.getDate() === day
  );
}

function toMinutes(time: string | null | undefined) {
  if (!time) {
    return null;
  }

  const match = /^(\d{2}):(\d{2})/.exec(time);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function slotDate(date: string, minutes: number) {
  return new Date(`${date}T${formatTime(minutes)}:00`);
}

function overlaps(start: number, end: number, blockStart: number | null, blockEnd: number | null) {
  if (blockStart === null || blockEnd === null || blockEnd <= blockStart) {
    return false;
  }

  return start < blockEnd && end > blockStart;
}

function dayOfWeek(date: string) {
  return new Date(`${date}T00:00:00`).getDay();
}

async function getExistingBookingCounts(
  supabase: SupabaseClient<Database>,
  storeId: string,
  date: string,
) {
  const counts = new Map<string, number>();

  // TODO: Replace this legacy table lookup with the partner booking table once
  // the booking write path is added to this app.
  const { data, error } = await supabase
    .from("beauty_booking_requests")
    .select("booking_time, status")
    .eq("store_id", storeId)
    .eq("booking_date", date);

  if (error) {
    console.warn("Booking conflict lookup skipped", error.message);
    return counts;
  }

  for (const booking of (data ?? []) as BookingRow[]) {
    if (CANCELED_STATUSES.has(String(booking.status).toLowerCase())) {
      continue;
    }

    const time = booking.booking_time.slice(0, 5);
    counts.set(time, (counts.get(time) ?? 0) + 1);
  }

  return counts;
}

export async function getPublicAvailabilitySlots(
  supabase: SupabaseClient<Database>,
  input: { storeId: string; date: string | null; menuItemId: string | null },
): Promise<AvailabilityResult> {
  const date = input.date?.trim() ?? "";
  const menuItemId = input.menuItemId?.trim() ?? "";

  if (!isValidDateString(date)) {
    return { ok: false, status: 400, error: "Invalid date. Use YYYY-MM-DD." };
  }

  if (!menuItemId) {
    return { ok: false, status: 400, error: "menuItemId is required." };
  }

  const [{ data: store, error: storeError }, { data: menuItem, error: menuError }] =
    await Promise.all([
      supabase
        .from("stores")
        .select("id, capacity, lead_time_hours, slot_interval_minutes")
        .eq("id", input.storeId)
        .maybeSingle(),
      supabase
        .from("menu_items")
        .select("id, store_id, duration_min, visible, review_status")
        .eq("id", menuItemId)
        .eq("store_id", input.storeId)
        .eq("visible", true)
        .eq("review_status", "approved")
        .maybeSingle(),
    ]);

  if (storeError) {
    throw new Error(storeError.message);
  }

  if (menuError) {
    throw new Error(menuError.message);
  }

  if (!store) {
    return { ok: false, status: 404, error: "Store not found." };
  }

  if (!menuItem) {
    return { ok: false, status: 404, error: "Menu item not found." };
  }

  const scheduleStore = store as StoreScheduleSettings;
  const approvedMenuItem = menuItem as MenuItem;
  const capacity = Math.max(DEFAULT_CAPACITY, scheduleStore.capacity ?? DEFAULT_CAPACITY);
  const leadTimeHours = Math.max(0, scheduleStore.lead_time_hours ?? DEFAULT_LEAD_TIME_HOURS);
  const interval = Math.max(
    1,
    scheduleStore.slot_interval_minutes ?? DEFAULT_SLOT_INTERVAL_MINUTES,
  );
  const duration = Math.max(
    DEFAULT_SLOT_INTERVAL_MINUTES,
    approvedMenuItem.duration_min ?? DEFAULT_DURATION_MINUTES,
  );

  const [{ data: closedDate, error: closedError }, { data: businessHour, error: hoursError }] =
    await Promise.all([
      supabase
        .from("closed_dates")
        .select("id")
        .eq("store_id", input.storeId)
        .eq("closed_date", date)
        .maybeSingle(),
      supabase
        .from("business_hours")
        .select("*")
        .eq("store_id", input.storeId)
        .eq("day_of_week", dayOfWeek(date))
        .maybeSingle(),
    ]);

  if (closedError) {
    throw new Error(closedError.message);
  }

  if (hoursError) {
    throw new Error(hoursError.message);
  }

  if (closedDate) {
    return { ok: true, date, storeId: input.storeId, menuItemId, slots: [], closed: true };
  }

  const hours = businessHour as BusinessHour | null;
  const isOpen = hours ? hours.is_open : dayOfWeek(date) >= 1 && dayOfWeek(date) <= 6;
  const start = toMinutes(hours?.start_time) ?? toMinutes(DEFAULT_START_TIME)!;
  const end = toMinutes(hours?.end_time) ?? toMinutes(DEFAULT_END_TIME)!;
  const breakStart = toMinutes(hours?.break_start_time);
  const breakEnd = toMinutes(hours?.break_end_time);

  if (!isOpen || end <= start) {
    return { ok: true, date, storeId: input.storeId, menuItemId, slots: [], closed: true };
  }

  const bookingCounts = await getExistingBookingCounts(supabase, input.storeId, date);
  const leadCutoff = new Date(Date.now() + leadTimeHours * 60 * 60 * 1000);
  const slots: AvailabilitySlot[] = [];

  for (let startMinutes = start; startMinutes + duration <= end; startMinutes += interval) {
    const serviceEnd = startMinutes + duration;
    const time = formatTime(startMinutes);

    if (overlaps(startMinutes, serviceEnd, breakStart, breakEnd)) {
      slots.push({ time, available: false, reason: "break_time" });
      continue;
    }

    if (slotDate(date, startMinutes) < leadCutoff) {
      slots.push({ time, available: false, reason: "lead_time" });
      continue;
    }

    if ((bookingCounts.get(time) ?? 0) >= capacity) {
      slots.push({ time, available: false, reason: "fully_booked" });
      continue;
    }

    slots.push({ time, available: true });
  }

  return { ok: true, date, storeId: input.storeId, menuItemId, slots, closed: false };
}
