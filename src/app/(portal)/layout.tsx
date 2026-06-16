import { getSupabaseServerClient } from "@/lib/supabase/server";
import PortalShell from "./PortalShell";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  let isAdmin = false;

  if (data.user) {
    await supabase.from("partner_profiles").upsert(
      {
        id: data.user.id,
        email: data.user.email ?? "",
        name:
          (data.user.user_metadata?.full_name as string | undefined) ??
          (data.user.user_metadata?.name as string | undefined) ??
          "",
      },
      { onConflict: "id", ignoreDuplicates: true },
    );

    const { data: profile } = await supabase
      .from("partner_profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .maybeSingle();

    isAdmin = profile?.is_admin === true;
  }

  return (
    <PortalShell userEmail={data.user?.email ?? null} isAdmin={isAdmin}>
      {children}
    </PortalShell>
  );
}
