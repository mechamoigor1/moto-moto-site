"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registrarLog } from "./auditoria";
import { slugify } from "@/lib/utils";
import { publicStorageObject } from "@/lib/storage-url";
import type { StatusMoto } from "@/types/database";

const motoSchema = z.object({
  marca_id: z.string().min(1, "Selecione a marca."),
  categoria_id: z.string().min(1).nullable(),
  modelo: z.string().trim().min(1, "Informe o modelo."),
  ano: z.coerce.number().int().min(1970).max(2100),
  km: z.coerce.number().int().min(0),
  preco: z.coerce.number().min(0),
  descricao: z.string().trim().optional(),
  status: z.enum(["disponivel", "reservada", "vendida", "oculta"]),
  destaque: z.coerce.boolean().optional(),
});

export type EstadoMoto = {
  status: "idle" | "erro";
  mensagem?: string;
};

function parseSpecs(formData: FormData) {
  const chaves = formData.getAll("spec_chave") as string[];
  const valores = formData.getAll("spec_valor") as string[];
  const specs: Record<string, string> = {};
  chaves.forEach((chave, i) => {
    const chaveLimpa = chave.trim();
    const valor = (valores[i] ?? "").trim();
    if (chaveLimpa && valor) specs[chaveLimpa] = valor;
  });
  return specs;
}

function revalidarPublico(slug?: string, marcaSlug?: string) {
  revalidatePath("/");
  revalidatePath("/motos");
  if (slug) revalidatePath(`/motos/${slug}`);
  if (marcaSlug) revalidatePath(`/marcas/${marcaSlug}`);
}

async function gerarSlugUnico(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  ignorarId?: string
) {
  const baseSlug = slugify(base);
  let slug = baseSlug;
  let contador = 1;

  while (true) {
    let query = supabase.from("motos").select("id").eq("slug", slug).limit(1);
    if (ignorarId) query = query.neq("id", ignorarId);
    const { data } = await query;
    if (!data || data.length === 0) return slug;
    contador += 1;
    slug = `${baseSlug}-${contador}`;
  }
}

export async function criarMoto(
  _estadoAnterior: EstadoMoto,
  formData: FormData
): Promise<EstadoMoto> {
  const parsed = motoSchema.safeParse({
    marca_id: formData.get("marca_id"),
    categoria_id: formData.get("categoria_id") || null,
    modelo: formData.get("modelo"),
    ano: formData.get("ano"),
    km: formData.get("km"),
    preco: formData.get("preco"),
    descricao: formData.get("descricao"),
    status: formData.get("status"),
    destaque: formData.get("destaque") === "on",
  });

  if (!parsed.success) {
    return { status: "erro", mensagem: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data: marca } = await supabase
    .from("marcas")
    .select("nome, slug")
    .eq("id", parsed.data.marca_id)
    .maybeSingle();

  if (!marca) return { status: "erro", mensagem: "Marca inválida." };

  const slug = await gerarSlugUnico(supabase, `${marca.nome} ${parsed.data.modelo} ${parsed.data.ano}`);
  const specs = parseSpecs(formData);

  const { data: moto, error } = await supabase
    .from("motos")
    .insert({
      ...parsed.data,
      descricao: parsed.data.descricao || null,
      destaque: Boolean(parsed.data.destaque),
      specs,
      slug,
      visualizacoes: 0,
    })
    .select("id, slug")
    .single();

  if (error || !moto) {
    return { status: "erro", mensagem: "Não foi possível salvar a moto." };
  }

  await registrarLog(supabase, "criou_moto", "motos", moto.id, { slug: moto.slug });
  revalidarPublico(moto.slug, marca.slug);
  redirect(`/admin/motos/${moto.id}/editar?criada=1`);
}

export async function atualizarMoto(
  id: string,
  _estadoAnterior: EstadoMoto,
  formData: FormData
): Promise<EstadoMoto> {
  const parsed = motoSchema.safeParse({
    marca_id: formData.get("marca_id"),
    categoria_id: formData.get("categoria_id") || null,
    modelo: formData.get("modelo"),
    ano: formData.get("ano"),
    km: formData.get("km"),
    preco: formData.get("preco"),
    descricao: formData.get("descricao"),
    status: formData.get("status"),
    destaque: formData.get("destaque") === "on",
  });

  if (!parsed.success) {
    return { status: "erro", mensagem: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data: marca } = await supabase
    .from("marcas")
    .select("nome, slug")
    .eq("id", parsed.data.marca_id)
    .maybeSingle();

  if (!marca) return { status: "erro", mensagem: "Marca inválida." };

  const { data: atual } = await supabase.from("motos").select("slug").eq("id", id).maybeSingle();
  const novoSlugBase = `${marca.nome} ${parsed.data.modelo} ${parsed.data.ano}`;
  const slug = slugify(novoSlugBase) === atual?.slug
    ? atual.slug
    : await gerarSlugUnico(supabase, novoSlugBase, id);

  const specs = parseSpecs(formData);

  const { error } = await supabase
    .from("motos")
    .update({
      ...parsed.data,
      descricao: parsed.data.descricao || null,
      destaque: Boolean(parsed.data.destaque),
      specs,
      slug,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { status: "erro", mensagem: "Não foi possível atualizar a moto." };
  }

  await registrarLog(supabase, "editou_moto", "motos", id, { slug });
  revalidarPublico(slug, marca.slug);
  if (atual?.slug && atual.slug !== slug) revalidarPublico(atual.slug);

  return { status: "idle", mensagem: "Alterações salvas." };
}

type MotoComMarcaSlug = { slug: string; marca: { slug: string } | null };

export async function excluirMoto(id: string) {
  const supabase = await createClient();
  const { data: moto } = await supabase
    .from("motos")
    .select("slug, marca:marcas(slug)")
    .eq("id", id)
    .maybeSingle()
    .returns<MotoComMarcaSlug>();

  const { data: imagens, error: imagensError } = await supabase
    .from("imagens")
    .select("url")
    .eq("moto_id", id);

  if (imagensError) throw new Error("Não foi possível localizar as fotos da moto.");

  for (const imagem of imagens ?? []) {
    const object = publicStorageObject(imagem.url);
    if (!object) throw new Error("Não foi possível localizar um arquivo de foto da moto.");

    const { error: storageError } = await supabase.storage.from(object.bucket).remove([object.path]);
    if (storageError) {
      throw new Error("Não foi possível remover todas as fotos da moto. A moto não foi apagada.");
    }
  }

  const { error } = await supabase.from("motos").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir a moto.");

  await registrarLog(supabase, "excluiu_moto", "motos", id, { slug: moto?.slug });
  revalidarPublico(moto?.slug, moto?.marca?.slug);
  revalidatePath("/admin/motos");
}

export async function alterarStatusMoto(id: string, status: StatusMoto) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("motos")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug, marca:marcas(slug)")
    .single();

  if (error) throw new Error("Não foi possível alterar o status.");

  const moto = data as unknown as MotoComMarcaSlug;

  await registrarLog(supabase, "alterou_status_moto", "motos", id, { status });
  revalidarPublico(moto.slug, moto.marca?.slug);
  revalidatePath("/admin/motos");
}
