import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type Store = Database["public"]["Tables"]["stores"]["Row"];

// Every partner gets exactly one store row. Created lazily on first visit
// so onboarding (business type selection) has somewhere to write to.
export async function getOrCreateStore(
  supabase: SupabaseClient<Database>,
  ownerId: string,
): Promise<Store> {
  const { data: existing, error: selectError } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (selectError) {
    throw new Error(selectError.message);
  }

  if (existing) {
    return existing;
  }

  const { data: created, error: insertError } = await supabase
    .from("stores")
    .insert({ owner_id: ownerId })
    .select("*")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return created;
}
