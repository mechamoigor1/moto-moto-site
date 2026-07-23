import { FormNomeSimples } from "@/components/admin/FormNomeSimples";
import { BotaoExcluirSimples } from "@/components/admin/BotaoExcluirSimples";
import { criarCategoria, excluirCategoria } from "@/lib/actions/categorias";
import { getCategorias } from "@/lib/data/categorias";

export default async function AdminCategoriasPage() {
  const categorias = await getCategorias();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-3xl font-black uppercase">Categorias</h1>

      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <FormNomeSimples action={criarCategoria} placeholder="Nome da categoria" textoBotao="Adicionar" />
      </div>

      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
        {categorias.map((categoria) => (
          <li key={categoria.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-white">{categoria.nome}</span>
            <BotaoExcluirSimples
              nome={categoria.nome}
              onExcluir={excluirCategoria.bind(null, categoria.id)}
            />
          </li>
        ))}
        {categorias.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-muted">Nenhuma categoria cadastrada.</li>
        )}
      </ul>
    </div>
  );
}
