"use client";

import { useActionState } from "react";
import { entrar, type EstadoLogin } from "@/lib/actions/auth";

const ESTADO_INICIAL: EstadoLogin = { status: "idle" };

export function FormularioLogin({ next }: { next: string }) {
  const [estado, formAction, pending] = useActionState(entrar, ESTADO_INICIAL);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-white placeholder:text-muted focus:border-orange/50 focus:outline-none"
          placeholder="voce@loja.com"
        />
      </div>
      <div>
        <label htmlFor="senha" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-white placeholder:text-muted focus:border-orange/50 focus:outline-none"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-orange px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
      {estado.status === "erro" && <p className="text-sm text-orange">{estado.mensagem}</p>}
    </form>
  );
}
