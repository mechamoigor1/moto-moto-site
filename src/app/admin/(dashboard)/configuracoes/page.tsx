import { FormConfiguracoes } from "@/components/admin/FormConfiguracoes";
import { getConfiguracoes } from "@/lib/data/configuracoes";

export default async function AdminConfiguracoesPage() {
  const config = await getConfiguracoes();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-3xl font-black uppercase">Configurações</h1>
      <div className="rounded-xl border border-border bg-card p-5">
        <FormConfiguracoes config={config} />
      </div>
    </div>
  );
}
