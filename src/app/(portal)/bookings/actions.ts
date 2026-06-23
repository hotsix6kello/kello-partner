"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireApprovedPartnerStore } from "@/lib/store/data";
import { KELLO_CONFIRMED_BOOKING_STATUSES } from "@/lib/partner-bookings/data";

type PartnerVisitStatus = "completed" | "no_show";

export async function updatePartnerVisitStatus(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const store = await requireApprovedPartnerStore(supabase);
  const bookingId = String(formData.get("booking_id") ?? "");
  const visitStatus = String(formData.get("partner_visit_status") ?? "") as PartnerVisitStatus;

  if (!bookingId || !["completed", "no_show"].includes(visitStatus)) {
    throw new Error("방문 확인 상태가 올바르지 않습니다.");
  }

  const { error } = await supabase
    .from("beauty_booking_requests")
    .update({
      partner_visit_status: visitStatus,
    })
    .eq("id", bookingId)
    .eq("store_id", store.id)
    .in("status", [...KELLO_CONFIRMED_BOOKING_STATUSES]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/bookings");
  revalidatePath(`/bookings/${bookingId}`);
}
