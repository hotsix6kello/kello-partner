import type { SupabaseClient } from "@supabase/supabase-js";
import { requireApprovedPartner, type PartnerAccess } from "@/lib/partners/access";
import type { Database } from "@/lib/supabase/database.types";

export type Store = Database["public"]["Tables"]["stores"]["Row"];
type ApprovedPartnerAccess = Extract<PartnerAccess, { status: "approved" }>;

async function linkLegacyStoreToPartner(
  supabase: SupabaseClient<Database>,
  store: Store,
  partnerId: number,
): Promise<Store> {
  if (store.partner_id === partnerId) {
    return store;
  }

  const { data, error } = await supabase
    .from("stores")
    .update({ partner_id: partnerId })
    .eq("id", store.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Store rows are created lazily, but only after the logged-in user is matched
// to an approved partner application.
export async function getOrCreateStoreForApprovedPartner(
  supabase: SupabaseClient<Database>,
  approvedAccess?: ApprovedPartnerAccess,
): Promise<Store> {
  const access = approvedAccess ?? (await requireApprovedPartner(supabase));
  const ownerId = access.user.id;
  const partnerId = access.partner.id;

  const { data: existing, error: selectError } = await supabase
    .from("stores")
    .select("*")
    .eq("partner_id", partnerId)
    .maybeSingle();

  if (selectError) {
    throw new Error(selectError.message);
  }

  if (existing) {
    return existing;
  }

  const { data: legacyStore, error: legacySelectError } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (legacySelectError) {
    throw new Error(legacySelectError.message);
  }

  if (legacyStore) {
    return linkLegacyStoreToPartner(supabase, legacyStore, partnerId);
  }

  const { data: created, error: insertError } = await supabase
    .from("stores")
    .insert({ owner_id: ownerId, partner_id: partnerId })
    .select("*")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return created;
}

export async function requireApprovedPartnerStore(
  supabase: SupabaseClient<Database>,
): Promise<Store> {
  return getOrCreateStoreForApprovedPartner(supabase);
}
