"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarLog } from "./auditoria";
import type { EstadoFormSimples } from "./marcas";

const schema = z.object({
  nome_loja: z.string().trim().min(1),
  whatsapp: z.string().trim().min(8, "Informe o WhatsApp com DDI e DDD (ex: 5519999999999)."),
  telefone_display: z.string().trim().min(1),
  endereco: z.string().trim().min(1),
  cidade_estado: z.string().trim().min(1),
  instagram: z.string().trim().min(1),
  horario_semana: z.string().trim().min(1),
  horario_sabado: z.string().trim().min(1),
  maps_url: z.string().trim().url("URL do Google Maps inválida."),
});

export async function atualizarConfiguracoes(
  _estadoAnterior: EstadoFormSimples,
  formData: FormData
): Promise<EstadoFormSimples> {
  const parsed = schema.safeParse({
    nome_loja: formData.get("nome_loja"),
    whatsapp: formData.get("whatsapp"),
    telefone_display: formData.get("telefone_display"),
    endereco: formData.get("endereco"),
    cidade_estado: formData.get("cidade_estado"),
    instagram: formData.get("instagram"),
    horario_semana: formData.get("horario_semana"),
    horario_sabado: formData.get("horario_sabado"),
    maps_url: formData.get("maps_url"),
  });

  if (!parsed.success) {
    return { status: "erro", mensagem: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("configuracoes")
    .upsert({ id: 1, ...parsed.data, updated_at: new Date().toISOString() });

  if (error) return { status: "erro", mensagem: "Não foi possível salvar as configurações." };

  await registrarLog(supabase, "editou_configuracoes", "configuracoes", "1");
  revalidatePath("/", "layout");
  return { status: "idle", mensagem: "Configurações salvas." };
}
