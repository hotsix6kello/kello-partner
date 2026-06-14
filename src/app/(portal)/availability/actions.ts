"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateStore } from "@/lib/store/data";
import type { Database } from "@/lib/supabase/database.types";

async function requireStore(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("로그인이 필요합니다.");
  }

  return getOrCreateStore(supabase, data.user.id);
}

export async function updateScheduleSettings(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const store = await requireStore(supabase);

  const capacity = Number(formData.get("capacity"));
  const leadTimeHours = Number(formData.get("leadTimeHours"));
  const slotIntervalMinutes = Number(formData.get("slotIntervalMinutes"));

  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new Error("동시 수용 인원은 1 이상의 정수여야 합니다.");
  }

  if (!Number.isInteger(leadTimeHours) || leadTimeHours < 0) {
    throw new Error("예약 마감 시간은 0 이상의 정수여야 합니다.");
  }

  if (!Number.isInteger(slotIntervalMinutes) || slotIntervalMinutes <= 0) {
    throw new Error("예약 슬롯 간격은 1 이상의 정수여야 합니다.");
  }

  const { error } = await supabase
    .from("stores")
    .update({
      capacity,
      lead_time_hours: leadTimeHours,
      slot_interval_minutes: slotIntervalMinutes,
    })
    .eq("id", store.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/availability");
}

export async function updateBusinessHours(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const store = await requireStore(supabase);

  const rows: Database["public"]["Tables"]["business_hours"]["Insert"][] = [];

  for (let day = 0; day <= 6; day++) {
    const isOpen = formData.get(`isOpen-${day}`) === "on";
    const startTime = (formData.get(`startTime-${day}`) as string) || null;
    const endTime = (formData.get(`endTime-${day}`) as string) || null;
    const hasBreak = formData.get(`hasBreak-${day}`) === "on";
    const breakStart = hasBreak ? (formData.get(`breakStart-${day}`) as string) || null : null;
    const breakEnd = hasBreak ? (formData.get(`breakEnd-${day}`) as string) || null : null;

    if (isOpen) {
      if (!startTime || !endTime) {
        throw new Error("영업일에는 시작/종료 시간을 입력해 주세요.");
      }

      if (startTime >= endTime) {
        throw new Error("종료 시간은 시작 시간보다 늦어야 합니다.");
      }

      if (hasBreak) {
        if (!breakStart || !breakEnd) {
          throw new Error("휴식 시간을 모두 입력해 주세요.");
        }

        if (breakStart >= breakEnd || breakStart < startTime || breakEnd > endTime) {
          throw new Error("휴식 시간은 영업 시간 내에서 시작보다 늦고 종료보다 빨라야 합니다.");
        }
      }
    }

    rows.push({
      store_id: store.id,
      day_of_week: day,
      is_open: isOpen,
      start_time: startTime,
      end_time: endTime,
      break_start_time: breakStart,
      break_end_time: breakEnd,
    });
  }

  const { error } = await supabase
    .from("business_hours")
    .upsert(rows, { onConflict: "store_id,day_of_week" });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/availability");
}

export async function addClosedDate(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const store = await requireStore(supabase);

  const closedDate = formData.get("closedDate") as string;
  const reason = (formData.get("reason") as string)?.trim();

  if (!closedDate) {
    throw new Error("휴무일을 선택해 주세요.");
  }

  const { error } = await supabase.from("closed_dates").insert({
    store_id: store.id,
    closed_date: closedDate,
    reason: reason || null,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("이미 휴무일로 등록된 날짜입니다.");
    }

    throw new Error(error.message);
  }

  revalidatePath("/availability");
}

export async function deleteClosedDate(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireStore(supabase);

  const id = formData.get("id") as string;

  const { error } = await supabase.from("closed_dates").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/availability");
}
