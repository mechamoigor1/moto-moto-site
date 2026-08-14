"use client";

import { useActionState } from "react";
import { enviarContato, type EstadoContato } from "@/lib/actions/contatos";

const ESTADO_INICIAL: EstadoContato = { status: "idle" };

export function FormularioContato() {
  const [estado, formAction, pending] = useActionState(enviarContato, ESTADO_INICIAL);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="nome" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          required
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-white placeholder:text-muted focus:border-orange/50 focus:outline-none"
          placeholder="Seu nome"
        />
      </div>
      <div>
        <label htmlFor="telefone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          Telefone
        </label>
        <input
          id="telefone"
          name="telefone"
          required
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-white placeholder:text-muted focus:border-orange/50 focus:outline-none"
          placeholder="(19) 99999-9999"
        />
      </div>
      <div>
        <label htmlFor="mensagem" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-white placeholder:text-muted focus:border-orange/50 focus:outline-none"
          placeholder="Conta pra gente o que você procura"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-orange px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Enviar mensagem"}
      </button>
      {estado.status !== "idle" && (
        <p className={`text-sm ${estado.status === "sucesso" ? "text-green" : "text-orange"}`}>
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}
