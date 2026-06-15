import { NextResponse } from "next/server";
import { getPublicStores } from "@/lib/public/catalog";
import { getSupabasePublicClient } from "@/lib/supabase/public";

export async function GET() {
  const supabase = getSupabasePublicClient();
  const stores = await getPublicStores(supabase);

  return NextResponse.json({
    ok: true,
    stores,
  });
}
