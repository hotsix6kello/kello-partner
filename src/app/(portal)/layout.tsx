import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import PortalShell from "./PortalShell";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return <PortalShell userEmail={data.user.email ?? null}>{children}</PortalShell>;
}
