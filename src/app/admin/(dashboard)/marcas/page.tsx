import { FormNomeSimples } from "@/components/admin/FormNomeSimples";
import { BotaoExcluirSimples } from "@/components/admin/BotaoExcluirSimples";
import { criarMarca, excluirMarca } from "@/lib/actions/marcas";
import { getMarcas } from "@/lib/data/marcas";

export default async function AdminMarcasPage() {
  const marcas = await getMarcas();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-3xl font-black uppercase">Marcas</h1>

      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <FormNomeSimples action={criarMarca} placeholder="Nome da marca" textoBotao="Adicionar" />
      </div>

      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
        {marcas.map((marca) => (
          <li key={marca.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-white">{marca.nome}</span>
            <BotaoExcluirSimples nome={marca.nome} onExcluir={excluirMarca.bind(null, marca.id)} />
          </li>
        ))}
        {marcas.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-muted">Nenhuma marca cadastrada.</li>
        )}
      </ul>
    </div>
  );
}
