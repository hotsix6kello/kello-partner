import { NextResponse } from "next/server";
import { getPublicStoreDetail } from "@/lib/public/catalog";
import { getSupabasePublicClient } from "@/lib/supabase/public";

export async function GET(
  _request: Request,
  context: { params: Promise<{ storeId: string }> },
) {
  const { storeId } = await context.params;
  const supabase = getSupabasePublicClient();
  const catalog = await getPublicStoreDetail(supabase, storeId);

  if (!catalog) {
    return NextResponse.json({ ok: false, error: "Store not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    store: catalog,
  });
}
