import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Contato, MotoComRelacoes } from "@/types/database";

const MOTO_SELECT = "*, marca:marcas(*), categoria:categorias(*), imagens(*)";

export async function getTodasMotos(): Promise<MotoComRelacoes[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("motos")
    .select(MOTO_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar motos (admin):", error.message);
    return [];
  }
  return (data ?? []) as unknown as MotoComRelacoes[];
}

export async function getMotoParaEdicao(id: string): Promise<MotoComRelacoes | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("motos")
    .select(MOTO_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as MotoComRelacoes;
}

export async function getContatos(): Promise<Contato[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contatos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return [];
  return data ?? [];
}

export async function getDashboardStats() {
  const motos = await getTodasMotos();
  const contatos = await getContatos();

  return {
    total: motos.length,
    disponivel: motos.filter((m) => m.status === "disponivel").length,
    reservada: motos.filter((m) => m.status === "reservada").length,
    vendida: motos.filter((m) => m.status === "vendida").length,
    oculta: motos.filter((m) => m.status === "oculta").length,
    contatosRecentes: contatos.slice(0, 5),
  };
}
