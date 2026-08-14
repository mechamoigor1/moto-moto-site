"use client";

import { useActionState } from "react";
import { atualizarConfiguracoes } from "@/lib/actions/configuracoes";
import type { EstadoFormSimples } from "@/lib/actions/marcas";
import type { Configuracoes } from "@/types/database";

const ESTADO_INICIAL: EstadoFormSimples = { status: "idle" };

export function FormConfiguracoes({ config }: { config: Configuracoes }) {
  const [estado, formAction, pending] = useActionState(atualizarConfiguracoes, ESTADO_INICIAL);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Campo label="Nome da loja">
        <input name="nome_loja" defaultValue={config.nome_loja} required className="campo-input" />
      </Campo>
      <Campo label="WhatsApp (DDI + DDD + número, só dígitos)">
        <input name="whatsapp" defaultValue={config.whatsapp} required className="campo-input" placeholder="5519999999999" />
      </Campo>
      <Campo label="Telefone (exibição)">
        <input name="telefone_display" defaultValue={config.telefone_display} required className="campo-input" />
      </Campo>
      <Campo label="Endereço">
        <input name="endereco" defaultValue={config.endereco} required className="campo-input" />
      </Campo>
      <Campo label="Cidade / Bairro">
        <input name="cidade_estado" defaultValue={config.cidade_estado} required className="campo-input" />
      </Campo>
      <Campo label="Instagram (sem @)">
        <input name="instagram" defaultValue={config.instagram} required className="campo-input" />
      </Campo>
      <Campo label="Horário de semana">
        <input name="horario_semana" defaultValue={config.horario_semana} required className="campo-input" />
      </Campo>
      <Campo label="Horário de sábado">
        <input name="horario_sabado" defaultValue={config.horario_sabado} required className="campo-input" />
      </Campo>
      <Campo label="Link do Google Maps">
        <input name="maps_url" type="url" defaultValue={config.maps_url} required className="campo-input" />
      </Campo>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-orange px-6 py-3 text-sm font-bold text-white hover:bg-orange-dark disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar configurações"}
        </button>
        {estado.status === "erro" && <p className="text-sm text-orange">{estado.mensagem}</p>}
        {estado.status === "idle" && estado.mensagem && <p className="text-sm text-green">{estado.mensagem}</p>}
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
