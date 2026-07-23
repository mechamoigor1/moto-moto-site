import { getContatos } from "@/lib/data/admin";

export default async function AdminContatosPage() {
  const contatos = await getContatos();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-black uppercase">Contatos</h1>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-dark text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Mensagem</th>
              <th className="px-4 py-3">Origem</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {contatos.map((c) => (
              <tr key={c.id} className="border-t border-border align-top">
                <td className="px-4 py-3 font-medium text-white">{c.nome}</td>
                <td className="px-4 py-3 text-muted">{c.telefone}</td>
                <td className="px-4 py-3 text-muted">{c.mensagem ?? "—"}</td>
                <td className="px-4 py-3 text-muted capitalize">{c.origem}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {contatos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Nenhum contato recebido ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
