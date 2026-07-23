import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function registrarLog(
  supabase: SupabaseClient,
  acao: string,
  entidade: string,
  entidadeId: string | null,
  detalhes?: Record<string, unknown>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("logs_auditoria").insert({
    user_id: user?.id ?? null,
    acao,
    entidade,
    entidade_id: entidadeId,
    detalhes: detalhes ?? null,
  });
}
