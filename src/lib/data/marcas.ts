import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Marca } from "@/types/database";

export async function getMarcas(): Promise<Marca[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.from("marcas").select("*").order("nome");
  if (error) {
    console.error("Erro ao buscar marcas:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getMarcaBySlug(slug: string): Promise<Marca | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("marcas")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return null;
  return data;
}
