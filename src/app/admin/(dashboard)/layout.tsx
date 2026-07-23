import { Sidebar } from "@/components/admin/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  let email: string | undefined;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email;
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar email={email} />
      <div className="flex-1 overflow-x-hidden p-8">{children}</div>
    </div>
  );
}
