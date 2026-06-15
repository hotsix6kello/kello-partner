import { NextResponse } from "next/server";
import { getPublicAvailabilitySlots } from "@/lib/public/availability";
import { getSupabasePublicClient } from "@/lib/supabase/public";

export async function GET(
  request: Request,
  context: { params: Promise<{ storeId: string }> },
) {
  const { storeId } = await context.params;
  const url = new URL(request.url);
  const supabase = getSupabasePublicClient();

  const result = await getPublicAvailabilitySlots(supabase, {
    storeId,
    date: url.searchParams.get("date"),
    menuItemId: url.searchParams.get("menuItemId"),
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: result.status });
  }

  return NextResponse.json(result);
}
