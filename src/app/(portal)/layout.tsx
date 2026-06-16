import { getSupabaseServerClient } from "@/lib/supabase/server";
import PortalShell from "./PortalShell";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

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
  }

  return <PortalShell userEmail={data.user?.email ?? null}>{children}</PortalShell>;
}
