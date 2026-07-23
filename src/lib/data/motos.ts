import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { MotoComRelacoes } from "@/types/database";

const MOTO_SELECT = "*, marca:marcas(*), categoria:categorias(*), imagens(*)";

export type MotoFiltros = {
  marcaSlug?: string;
  busca?: string;
  precoMin?: number;
  precoMax?: number;
};

function ordenarImagens(moto: MotoComRelacoes): MotoComRelacoes {
  return {
    ...moto,
    imagens: [...(moto.imagens ?? [])].sort((a, b) => a.ordem - b.ordem),
  };
}

export async function getMotosPublicadas(filtros: MotoFiltros = {}): Promise<MotoComRelacoes[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  let query = supabase
    .from("motos")
    .select(MOTO_SELECT)
    .neq("status", "oculta")
    .order("destaque", { ascending: false })
    .order("created_at", { ascending: false });

  if (typeof filtros.precoMin === "number") {
    query = query.gte("preco", filtros.precoMin);
  }
  if (typeof filtros.precoMax === "number") {
    query = query.lte("preco", filtros.precoMax);
  }
  if (filtros.busca) {
    query = query.ilike("modelo", `%${filtros.busca}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Erro ao buscar motos:", error.message);
    return [];
  }

  let motos = ((data ?? []) as unknown as MotoComRelacoes[]).map(ordenarImagens);

  if (filtros.marcaSlug) {
    motos = motos.filter((m) => m.marca?.slug === filtros.marcaSlug);
  }

  return motos;
}

export async function getMotoBySlug(slug: string): Promise<MotoComRelacoes | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("motos")
    .select(MOTO_SELECT)
    .eq("slug", slug)
    .neq("status", "oculta")
    .maybeSingle();

  if (error || !data) return null;
  return ordenarImagens(data as unknown as MotoComRelacoes);
}

export async function getMotosDestaque(limite = 6): Promise<MotoComRelacoes[]> {
  const motos = await getMotosPublicadas();
  return motos.filter((m) => m.destaque).slice(0, limite);
}
