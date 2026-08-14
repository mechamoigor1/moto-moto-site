import Link from "next/link";
import { getDashboardStats } from "@/lib/data/admin";

const CARDS = [
  { key: "total", label: "Total de motos", color: "text-white" },
  { key: "disponivel", label: "Disponíveis", color: "text-green" },
  { key: "reservada", label: "Reservadas", color: "text-orange" },
  { key: "vendida", label: "Vendidas", color: "text-muted" },
] as const;

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-black uppercase">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {CARDS.map((card) => (
          <div key={card.key} className="rounded-xl border border-border bg-card p-5">
            <div className={`font-display text-4xl font-black ${card.color}`}>
              {stats[card.key]}
            </div>
            <div className="mt-1 text-xs text-muted">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide">Contatos recentes</h2>
            <Link href="/admin/contatos" className="text-xs text-orange hover:underline">
              Ver todos
            </Link>
          </div>
          {stats.contatosRecentes.length === 0 ? (
            <p className="text-sm text-muted">Nenhum contato ainda.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {stats.contatosRecentes.map((c) => (
                <li key={c.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="text-sm font-medium">{c.nome}</div>
                  <div className="text-xs text-muted">{c.telefone}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">Ações rápidas</h2>
          <div className="flex flex-col gap-2">
            <Link
              href="/admin/motos/novo"
              className="rounded-lg bg-orange px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-orange-dark"
            >
              + Cadastrar moto
            </Link>
            <Link
              href="/admin/motos"
              className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold text-white hover:border-white/25"
            >
              Gerenciar estoque ({stats.total})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
