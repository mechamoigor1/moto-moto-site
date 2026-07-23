import Link from "next/link";
import { getTodasMotos } from "@/lib/data/admin";
import { formatKm, formatPreco } from "@/lib/utils";
import { SeletorStatus, BotaoExcluirMoto } from "@/components/admin/LinhaMotoAcoes";

export default async function AdminMotosPage() {
  const motos = await getTodasMotos();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-black uppercase">Motos</h1>
        <Link
          href="/admin/motos/novo"
          className="rounded-lg bg-orange px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-dark"
        >
          + Cadastrar moto
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-dark text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Moto</th>
              <th className="px-4 py-3">Km</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Destaque</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {motos.map((moto) => (
              <tr key={moto.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">
                    {moto.marca.nome} {moto.modelo} {moto.ano}
                  </div>
                  <div className="text-xs text-muted">{moto.imagens.length} foto(s)</div>
                </td>
                <td className="px-4 py-3 text-muted">{formatKm(moto.km)}</td>
                <td className="px-4 py-3 text-white">{formatPreco(moto.preco)}</td>
                <td className="px-4 py-3">
                  <SeletorStatus id={moto.id} status={moto.status} />
                </td>
                <td className="px-4 py-3">{moto.destaque ? "⭐" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/motos/${moto.id}/editar`}
                      className="text-xs font-semibold text-orange hover:underline"
                    >
                      Editar
                    </Link>
                    <BotaoExcluirMoto id={moto.id} nome={`${moto.marca.nome} ${moto.modelo}`} />
                  </div>
                </td>
              </tr>
            ))}
            {motos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Nenhuma moto cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
