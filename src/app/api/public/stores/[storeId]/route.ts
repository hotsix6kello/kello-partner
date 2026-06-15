import { NextResponse } from "next/server";
import { getApprovedPublicStoreCatalog } from "@/lib/public/catalog";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ storeId: string }> },
) {
  const { storeId } = await context.params;
  const supabase = await getSupabaseServerClient();
  const catalog = await getApprovedPublicStoreCatalog(supabase, storeId);

  if (!catalog) {
    return NextResponse.json({ error: "Store not found." }, { status: 404 });
  }

  return NextResponse.json(catalog);
}
