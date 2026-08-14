"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { publicStorageObject } from "@/lib/storage-url";
import { registrarLog } from "./auditoria";

type MotoComMarcaSlug = { slug: string; marca: { slug: string } | null };

async function motoInfo(supabase: Awaited<ReturnType<typeof createClient>>, motoId: string) {
  const { data } = await supabase
    .from("motos")
    .select("slug, marca:marcas(slug)")
    .eq("id", motoId)
    .maybeSingle()
    .returns<MotoComMarcaSlug>();
  return {
    slug: data?.slug,
    marcaSlug: data?.marca?.slug,
  };
}

function revalidarPublico(slug?: string, marcaSlug?: string) {
  revalidatePath("/");
  revalidatePath("/motos");
  if (slug) revalidatePath(`/motos/${slug}`);
  if (marcaSlug) revalidatePath(`/marcas/${marcaSlug}`);
}

export async function adicionarImagem(motoId: string, url: string, altText: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("imagens")
    .select("id", { count: "exact", head: true })
    .eq("moto_id", motoId);

  const { error } = await supabase.from("imagens").insert({
    moto_id: motoId,
    url,
    ordem: count ?? 0,
    alt_text: altText,
  });

  if (error) throw new Error("Não foi possível salvar a imagem.");

  await registrarLog(supabase, "adicionou_imagem", "imagens", motoId, { url });
  const { slug, marcaSlug } = await motoInfo(supabase, motoId);
  revalidarPublico(slug, marcaSlug);
  revalidatePath(`/admin/motos/${motoId}/editar`);
}

export async function removerImagem(imagemId: string, motoId: string) {
  const supabase = await createClient();
  const { data: imagem } = await supabase
    .from("imagens")
    .select("url")
    .eq("id", imagemId)
    .maybeSingle();

  if (imagem?.url) {
    const object = publicStorageObject(imagem.url);
    if (!object) throw new Error("Não foi possível localizar o arquivo da imagem.");

    const { error: storageError } = await supabase.storage.from(object.bucket).remove([object.path]);
    if (storageError) throw new Error("Não foi possível remover o arquivo da imagem. Tente novamente.");
  }

  const { error } = await supabase.from("imagens").delete().eq("id", imagemId);
  if (error) throw new Error("Não foi possível remover a imagem.");

  await registrarLog(supabase, "excluiu_foto", "imagens", motoId, { imagemId });
  const { slug, marcaSlug } = await motoInfo(supabase, motoId);
  revalidarPublico(slug, marcaSlug);
  revalidatePath(`/admin/motos/${motoId}/editar`);
}

export async function moverImagem(motoId: string, imagemId: string, direcao: "up" | "down") {
  const supabase = await createClient();
  const { data: imagens } = await supabase
    .from("imagens")
    .select("id, ordem")
    .eq("moto_id", motoId)
    .order("ordem", { ascending: true });

  if (!imagens) return;

  const index = imagens.findIndex((img) => img.id === imagemId);
  const alvo = direcao === "up" ? index - 1 : index + 1;
  if (index === -1 || alvo < 0 || alvo >= imagens.length) return;

  const atual = imagens[index];
  const vizinho = imagens[alvo];

  await Promise.all([
    supabase.from("imagens").update({ ordem: vizinho.ordem }).eq("id", atual.id),
    supabase.from("imagens").update({ ordem: atual.ordem }).eq("id", vizinho.id),
  ]);

  const { slug, marcaSlug } = await motoInfo(supabase, motoId);
  revalidarPublico(slug, marcaSlug);
  revalidatePath(`/admin/motos/${motoId}/editar`);
}
