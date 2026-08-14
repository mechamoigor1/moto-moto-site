import { FormularioLogin } from "@/components/admin/FormularioLogin";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <BrandLogo className="mx-auto h-20 w-auto" priority />
          <div className="mt-1 text-xs uppercase tracking-[1.5px] text-muted">
            Painel administrativo
          </div>
        </div>

        {!isSupabaseConfigured ? (
          <div className="rounded-xl border border-orange/30 bg-orange/10 p-5 text-sm text-white/90">
            Supabase ainda não configurado. Preencha <code className="text-orange">.env.local</code>{" "}
            e crie um usuário admin antes de acessar o painel.
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6">
            <FormularioLogin next={next ?? "/admin"} />
          </div>
        )}
      </div>
    </div>
  );
}
