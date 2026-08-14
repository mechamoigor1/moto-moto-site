"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const contatoSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome."),
  telefone: z.string().trim().min(8, "Informe um telefone válido."),
  mensagem: z.string().trim().optional(),
});

export type EstadoContato = {
  status: "idle" | "sucesso" | "erro";
  mensagem?: string;
};

export async function enviarContato(
  _estadoAnterior: EstadoContato,
  formData: FormData
): Promise<EstadoContato> {
  if (!isSupabaseConfigured) {
    return { status: "erro", mensagem: "Supabase não configurado ainda. Fale com a gente pelo WhatsApp." };
  }

  const parsed = contatoSchema.safeParse({
    nome: formData.get("nome"),
    telefone: formData.get("telefone"),
    mensagem: formData.get("mensagem"),
  });

  if (!parsed.success) {
    return { status: "erro", mensagem: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contatos").insert({
    nome: parsed.data.nome,
    telefone: parsed.data.telefone,
    mensagem: parsed.data.mensagem || null,
    origem: "formulario",
  });

  if (error) {
    return { status: "erro", mensagem: "Não foi possível enviar. Tenta de novo ou chama no WhatsApp." };
  }

  return { status: "sucesso", mensagem: "Recebemos sua mensagem! Vamos te chamar em breve." };
}
