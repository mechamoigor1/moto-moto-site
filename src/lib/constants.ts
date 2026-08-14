import type { Configuracoes } from "@/types/database";

/**
 * Usado enquanto o Supabase não está configurado ou a tabela `configuracoes`
 * ainda não tem uma linha — mantém o site funcional com os dados reais
 * da Moto Moto Paulínia extraídos do protótipo original.
 */
export const DEFAULT_CONFIGURACOES: Configuracoes = {
  id: 1,
  nome_loja: "Moto Moto Paulínia",
  whatsapp: "5519994451982",
  telefone_display: "(19) 99445-1982",
  endereco: "Av. José Paulino, 701",
  cidade_estado: "Centro, Paulínia/SP",
  instagram: "motomotopaulinia",
  horario_semana: "Seg–Sex 08h–18h",
  horario_sabado: "Sáb 08h–14h",
  maps_url: "https://maps.google.com/?q=Av.+José+Paulino,+701,+Centro,+Paulínia,+SP",
  updated_at: new Date(0).toISOString(),
};

export const MARCAS_PADRAO = ["Honda", "Yamaha", "Triumph", "Suzuki"];
