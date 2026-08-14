"use client";

import { useTransition } from "react";
import { alterarStatusMoto, excluirMoto } from "@/lib/actions/motos";
import type { StatusMoto } from "@/types/database";

export function SeletorStatus({ id, status }: { id: string; status: StatusMoto }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => alterarStatusMoto(id, e.target.value as StatusMoto))}
      className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-white focus:border-orange/50 focus:outline-none disabled:opacity-50"
    >
      <option value="disponivel">Disponível</option>
      <option value="reservada">Reservada</option>
      <option value="vendida">Vendida</option>
      <option value="oculta">Oculta</option>
    </select>
  );
}

export function BotaoExcluirMoto({ id, nome }: { id: string; nome: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Excluir "${nome}"? Essa ação não pode ser desfeita.`)) return;
    startTransition(() => excluirMoto(id));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-xs font-semibold text-muted hover:text-orange disabled:opacity-50"
    >
      {pending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
