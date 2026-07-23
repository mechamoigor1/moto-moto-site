"use client";

import { useTransition } from "react";

export function BotaoExcluirSimples({
  nome,
  onExcluir,
}: {
  nome: string;
  onExcluir: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Excluir "${nome}"?`)) return;
    startTransition(async () => {
      try {
        await onExcluir();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Não foi possível excluir.");
      }
    });
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
