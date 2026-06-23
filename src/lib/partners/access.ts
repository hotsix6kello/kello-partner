import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type Partner = Database["public"]["Tables"]["partners"]["Row"];

export type PartnerAccess =
  | { status: "not_authenticated"; user: null; partner: null }
  | { status: "no_partner"; user: User; partner: null }
  | { status: "draft"; user: User; partner: Partner }
  | { status: "pending_review"; user: User; partner: Partner }
  | { status: "needs_revision"; user: User; partner: Partner }
  | { status: "rejected"; user: User; partner: Partner }
  | { status: "suspended"; user: User; partner: Partner }
  | { status: "approved"; user: User; partner: Partner };

export const APPROVED_PARTNER_REQUIRED_MESSAGE = "승인된 파트너 계정이 필요합니다.";

function normalizePartnerStatus(status: string | null | undefined) {
  return status?.trim().toLowerCase();
}

function toPartnerAccess(user: User, partner: Partner | null): PartnerAccess {
  if (!partner) {
    return { status: "no_partner", user, partner };
  }

  const status = normalizePartnerStatus(partner.status);

  if (status === "approved") {
    return { status: "approved", user, partner };
  }

  if (status === "rejected") {
    return { status: "rejected", user, partner };
  }

  if (status === "draft") {
    return { status: "draft", user, partner };
  }

  if (status === "needs_revision") {
    return { status: "needs_revision", user, partner };
  }

  if (status === "suspended") {
    return { status: "suspended", user, partner };
  }

  return { status: "pending_review", user, partner };
}

export async function getPartnerAccessForCurrentUser(
  supabase: SupabaseClient<Database>,
): Promise<PartnerAccess> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { status: "not_authenticated", user: null, partner: null };
  }

  const email = data.user.email?.trim();

  if (!email) {
    return { status: "no_partner", user: data.user, partner: null };
  }

  const { data: partner, error: partnerError } = await supabase
    .from("partners")
    .select("*")
    .ilike("email", email)
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (partnerError) {
    console.error("Failed to load partner approval status", partnerError);
    throw new Error(APPROVED_PARTNER_REQUIRED_MESSAGE);
  }

  return toPartnerAccess(data.user, partner);
}

export async function requireApprovedPartner(
  supabase: SupabaseClient<Database>,
): Promise<Extract<PartnerAccess, { status: "approved" }>> {
  const access = await getPartnerAccessForCurrentUser(supabase);

  if (access.status !== "approved") {
    throw new Error(APPROVED_PARTNER_REQUIRED_MESSAGE);
  }

  return access;
}
