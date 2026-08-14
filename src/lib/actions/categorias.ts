"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarLog } from "./auditoria";
import { slugify } from "@/lib/utils";
import type { EstadoFormSimples } from "./marcas";

const schema = z.object({ nome: z.string().trim().min(1, "Informe o nome da categoria.") });

function revalidar() {
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/motos");
}

export async function criarCategoria(
  _estadoAnterior: EstadoFormSimples,
  formData: FormData
): Promise<EstadoFormSimples> {
  const parsed = schema.safeParse({ nome: formData.get("nome") });
  if (!parsed.success) return { status: "erro", mensagem: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categorias")
    .insert({ nome: parsed.data.nome, slug: slugify(parsed.data.nome) })
    .select("id")
    .single();

  if (error) {
    return { status: "erro", mensagem: "Não foi possível criar a categoria (nome já existe?)." };
  }

  await registrarLog(supabase, "criou_categoria", "categorias", data.id, { nome: parsed.data.nome });
  revalidar();
  return { status: "idle" };
}

export async function excluirCategoria(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) throw new Error("Não é possível excluir: existem motos cadastradas com essa categoria.");
  await registrarLog(supabase, "excluiu_categoria", "categorias", id);
  revalidar();
}
