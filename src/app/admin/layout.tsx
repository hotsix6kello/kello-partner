import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import PortalShell from "@/app/(portal)/PortalShell";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("partner_profiles")
    .select("is_admin")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect("/");
  }

  return (
    <PortalShell userEmail={data.user.email ?? null} isAdmin={true}>
      {children}
    </PortalShell>
  );
}
