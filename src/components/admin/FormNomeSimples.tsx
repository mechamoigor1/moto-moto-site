"use client";

import { useActionState, useRef, useEffect } from "react";
import type { EstadoFormSimples } from "@/lib/actions/marcas";

const ESTADO_INICIAL: EstadoFormSimples = { status: "idle" };

export function FormNomeSimples({
  action,
  placeholder,
  textoBotao,
}: {
  action: (estado: EstadoFormSimples, formData: FormData) => Promise<EstadoFormSimples>;
  placeholder: string;
  textoBotao: string;
}) {
  const [estado, formAction, pending] = useActionState(action, ESTADO_INICIAL);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado.status === "idle") formRef.current?.reset();
  }, [estado]);

  return (
    <form ref={formRef} action={formAction} className="flex gap-2">
      <input name="nome" required placeholder={placeholder} className="campo-input" />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-lg bg-orange px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-dark disabled:opacity-60"
      >
        {pending ? "..." : textoBotao}
      </button>
      {estado.status === "erro" && <p className="self-center text-xs text-orange">{estado.mensagem}</p>}
    </form>
  );
}
