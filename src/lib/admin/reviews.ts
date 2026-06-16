import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type AdminReviewAccess =
  | { isAdmin: false; user: User | null }
  | { isAdmin: true; user: User };

export async function getAdminReviewAccess(
  supabase: SupabaseClient<Database>,
): Promise<AdminReviewAccess> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { isAdmin: false, user: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("partner_profiles")
    .select("is_admin")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Failed to load admin review access", profileError);
    return { isAdmin: false, user: data.user };
  }

  const isAdmin = profile?.is_admin === true;

  return isAdmin ? { isAdmin: true, user: data.user } : { isAdmin: false, user: data.user };
}

export async function requireAdminReviewAccess(
  supabase: SupabaseClient<Database>,
): Promise<Extract<AdminReviewAccess, { isAdmin: true }>> {
  const access = await getAdminReviewAccess(supabase);

  if (!access.isAdmin) {
    throw new Error("관리자 권한이 필요합니다.");
  }

  return access;
}
