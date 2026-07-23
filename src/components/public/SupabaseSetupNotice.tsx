export function SupabaseSetupNotice() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-6">
      <div className="rounded-xl border border-orange/30 bg-orange/10 p-5 text-sm leading-relaxed text-white/90">
        <strong className="text-orange">Supabase ainda não configurado.</strong> Crie um projeto
        em{" "}
        <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline">
          supabase.com
        </a>
        , rode as migrations em <code className="text-orange">database/schema.sql</code> e o seed
        em <code className="text-orange">database/seed.sql</code>, depois preencha{" "}
        <code className="text-orange">.env.local</code> a partir de{" "}
        <code className="text-orange">.env.local.example</code>. Veja o README para o passo a
        passo completo.
      </div>
    </div>
  );
}
