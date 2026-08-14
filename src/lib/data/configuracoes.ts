import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { DEFAULT_CONFIGURACOES } from "@/lib/constants";
import type { Configuracoes } from "@/types/database";

export async function getConfiguracoes(): Promise<Configuracoes> {
  if (!isSupabaseConfigured) return DEFAULT_CONFIGURACOES;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return DEFAULT_CONFIGURACOES;
  return data;
}
