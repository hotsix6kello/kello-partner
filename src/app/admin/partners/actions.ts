"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdminReviewAccess } from "@/lib/admin/reviews";

export async function approvePartner(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireAdminReviewAccess(supabase);

  const id = Number(formData.get("id"));
  const { error } = await supabase
    .from("partners")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/partners");
}

export async function rejectPartner(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireAdminReviewAccess(supabase);

  const id = Number(formData.get("id"));
  const reject_reason = (formData.get("reject_reason") as string | null)?.trim() ?? "";

  const { error } = await supabase
    .from("partners")
    .update({ status: "rejected", reject_reason: reject_reason || null, reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/partners");
}

export async function togglePartnerVisibility(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireAdminReviewAccess(supabase);

  const id = Number(formData.get("id"));
  const current = formData.get("current_visibility") === "true";

  const { error } = await supabase
    .from("partners")
    .update({ visibility_status: !current })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/partners");
}
