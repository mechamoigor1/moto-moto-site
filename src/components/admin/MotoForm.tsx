"use client";

import { useActionState, useState } from "react";
import type { EstadoMoto } from "@/lib/actions/motos";
import type { Categoria, Marca, MotoComRelacoes, MotoSpecs } from "@/types/database";

const ESTADO_INICIAL: EstadoMoto = { status: "idle" };

type Action = (estado: EstadoMoto, formData: FormData) => Promise<EstadoMoto>;

export function MotoForm({
  action,
  marcas,
  categorias,
  moto,
  textoBotao = "Salvar moto",
}: {
  action: Action;
  marcas: Marca[];
  categorias: Categoria[];
  moto?: MotoComRelacoes | null;
  textoBotao?: string;
}) {
  const [estado, formAction, pending] = useActionState(action, ESTADO_INICIAL);
  const specsIniciais: MotoSpecs = moto?.specs ?? { cor: "", cilindrada: "" };
  const [specs, setSpecs] = useState<Array<{ chave: string; valor: string }>>(
    Object.entries(specsIniciais).map(([chave, valor]) => ({ chave, valor: valor ?? "" }))
  );

  function addSpec() {
    setSpecs((prev) => [...prev, { chave: "", valor: "" }]);
  }
  function removeSpec(i: number) {
    setSpecs((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateSpec(i: number, campo: "chave" | "valor", valor: string) {
    setSpecs((prev) => prev.map((s, idx) => (idx === i ? { ...s, [campo]: valor } : s)));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Campo label="Marca">
          <select
            name="marca_id"
            required
            defaultValue={moto?.marca_id ?? ""}
            className="campo-select"
          >
            <option value="" disabled>
              Selecione
            </option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Categoria">
          <select name="categoria_id" defaultValue={moto?.categoria_id ?? ""} className="campo-select">
            <option value="">Sem categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Modelo">
          <input name="modelo" required defaultValue={moto?.modelo ?? ""} className="campo-input" placeholder="Ex: CB 500" />
        </Campo>

        <Campo label="Ano">
          <input
            name="ano"
            type="number"
            required
            defaultValue={moto?.ano ?? new Date().getFullYear()}
            className="campo-input"
          />
        </Campo>

        <Campo label="Quilometragem">
          <input name="km" type="number" required defaultValue={moto?.km ?? 0} className="campo-input" />
        </Campo>

        <Campo label="Preço (R$)">
          <input
            name="preco"
            type="number"
            step="0.01"
            required
            defaultValue={moto?.preco ?? 0}
            className="campo-input"
          />
        </Campo>

        <Campo label="Status">
          <select name="status" defaultValue={moto?.status ?? "disponivel"} className="campo-select">
            <option value="disponivel">Disponível</option>
            <option value="reservada">Reservada</option>
            <option value="vendida">Vendida</option>
            <option value="oculta">Oculta</option>
          </select>
        </Campo>

        <label className="flex items-center gap-2.5 self-end pb-2.5 text-sm text-white">
          <input type="checkbox" name="destaque" defaultChecked={moto?.destaque ?? false} className="h-4 w-4 accent-orange" />
          Destacar na home
        </label>
      </div>

      <Campo label="Descrição">
        <textarea
          name="descricao"
          rows={4}
          defaultValue={moto?.descricao ?? ""}
          className="campo-input resize-none"
          placeholder="Detalhes sobre o estado da moto, histórico, revisões..."
        />
      </Campo>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Especificações (cor, cilindrada, etc.)
          </span>
          <button
            type="button"
            onClick={addSpec}
            className="text-xs font-semibold text-orange hover:underline"
          >
            + Adicionar campo
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                name="spec_chave"
                value={s.chave}
                onChange={(e) => updateSpec(i, "chave", e.target.value)}
                placeholder="cor"
                className="campo-input w-1/3"
              />
              <input
                name="spec_valor"
                value={s.valor}
                onChange={(e) => updateSpec(i, "valor", e.target.value)}
                placeholder="Preta"
                className="campo-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeSpec(i)}
                className="rounded-lg border border-border px-3 text-sm text-muted hover:border-orange/50 hover:text-orange"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-orange px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-60"
        >
          {pending ? "Salvando..." : textoBotao}
        </button>
        {estado.status === "erro" && <p className="text-sm text-orange">{estado.mensagem}</p>}
        {estado.status === "idle" && estado.mensagem && (
          <p className="text-sm text-green">{estado.mensagem}</p>
        )}
      </div>
    </form>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}
