"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdminReviewAccess } from "@/lib/admin/reviews";

export type DeletePartnerState = {
  message: string | null;
};

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

export async function requestPartnerRevision(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireAdminReviewAccess(supabase);

  const id = Number(formData.get("id"));
  const reject_reason = (formData.get("reject_reason") as string | null)?.trim() ?? "";

  const { error } = await supabase
    .from("partners")
    .update({ status: "needs_revision", reject_reason: reject_reason || null, reviewed_at: new Date().toISOString() })
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

function getDeletePartnerErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const message = error.message;

    if (message.toLowerCase().includes("row-level security")) {
      return "삭제 권한 정책이 아직 DB에 적용되지 않았습니다. Supabase migration 적용 후 다시 시도해 주세요.";
    }

    return message;
  }

  return "파트너 삭제 중 오류가 발생했습니다.";
}

async function deletePartnerRecord(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireAdminReviewAccess(supabase);

  const id = Number(formData.get("id"));
  const confirmation = (formData.get("confirmation") as string | null)?.trim() ?? "";

  if (!Number.isFinite(id)) {
    throw new Error("삭제할 파트너 정보가 올바르지 않습니다.");
  }

  const { data: partner, error: partnerError } = await supabase
    .from("partners")
    .select("id, company_name, status")
    .eq("id", id)
    .maybeSingle();

  if (partnerError) throw new Error(partnerError.message);
  if (!partner) throw new Error("삭제할 파트너를 찾을 수 없습니다.");
  if (!["rejected", "suspended"].includes(partner.status)) {
    throw new Error("반려/중지 상태의 파트너만 삭제할 수 있습니다.");
  }
  if (confirmation !== partner.company_name) {
    throw new Error("업체명을 정확히 입력해야 삭제할 수 있습니다.");
  }

  const { data: stores, error: storesError } = await supabase
    .from("stores")
    .select("id")
    .eq("partner_id", id);

  if (storesError) throw new Error(storesError.message);

  const storeIds = (stores ?? []).map((store) => store.id);

  if (storeIds.length > 0) {
    const { data: photos, error: photosError } = await supabase
      .from("photos")
      .select("storage_path")
      .in("store_id", storeIds)
      .not("storage_path", "is", null);

    if (photosError) throw new Error(photosError.message);

    const storagePaths = Array.from(
      new Set((photos ?? []).map((photo) => photo.storage_path).filter(Boolean)),
    );

    if (storagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("store-photos")
        .remove(storagePaths);

      if (storageError) throw new Error(storageError.message);
    }

    const { error: storeDeleteError } = await supabase.from("stores").delete().in("id", storeIds);

    if (storeDeleteError) throw new Error(storeDeleteError.message);
  }

  const { error: deleteError } = await supabase.from("partners").delete().eq("id", id);

  if (deleteError) throw new Error(deleteError.message);
  revalidatePath("/admin/partners");
}

export async function deletePartner(
  _previousState: DeletePartnerState,
  formData: FormData,
): Promise<DeletePartnerState> {
  try {
    await deletePartnerRecord(formData);
    return { message: null };
  } catch (error) {
    return { message: getDeletePartnerErrorMessage(error) };
  }
}

export async function togglePartnerVisibility(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireAdminReviewAccess(supabase);

  const id = Number(formData.get("id"));
  const current = formData.get("current_visibility") === "true";

  const { error } = await supabase
    .from("partners")
    .update({ is_public: !current, visibility_status: !current })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/partners");
}

export async function updatePartnerContractStatus(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  await requireAdminReviewAccess(supabase);

  const id = Number(formData.get("id"));
  const contract_status = String(formData.get("contract_status") ?? "");
  const allowed = ["not_started", "pending", "signed", "expired", "terminated"];

  if (!allowed.includes(contract_status)) {
    throw new Error("Invalid contract status");
  }

  const { error } = await supabase.from("partners").update({ contract_status }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/partners");
}
