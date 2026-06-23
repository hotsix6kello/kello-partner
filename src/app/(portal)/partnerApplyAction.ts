"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function applyForPartner(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user?.email) {
    throw new Error("로그인이 필요합니다.");
  }

  const email = userData.user.email.trim();
  const company_name = (formData.get("company_name") as string | null)?.trim() ?? "";
  const business_type = (formData.get("business_type") as string | null)?.trim() ?? "";
  const address = (formData.get("address") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const contact_name = (formData.get("contact_name") as string | null)?.trim() ?? "";

  if (!company_name || !business_type || !phone || !contact_name) {
    throw new Error("업체명, 업체카테고리, 매장번호, 대표 성함은 필수 항목입니다.");
  }

  const { data: existing } = await supabase
    .from("partners")
    .select("id, status")
    .ilike("email", email)
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing) {
    if (["pending", "pending_review"].includes(existing.status?.toLowerCase() ?? "")) {
      throw new Error("이미 검토 중인 신청이 있습니다.");
    }

    const { error } = await supabase
      .from("partners")
      .update({
        company_name,
        business_type,
        address: address || null,
        phone,
        contact_name,
        status: "pending_review",
        reject_reason: null,
        reviewed_at: null,
      })
      .eq("id", existing.id);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("partners").insert({
      email,
      company_name,
      business_type,
      address: address || null,
      phone,
      contact_name,
      status: "pending_review",
    });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
}
