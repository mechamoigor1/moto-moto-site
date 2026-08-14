import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Categoria } from "@/types/database";

export async function getCategorias(): Promise<Categoria[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.from("categorias").select("*").order("nome");
  if (error) {
    console.error("Erro ao buscar categorias:", error.message);
    return [];
  }
  return data ?? [];
}
