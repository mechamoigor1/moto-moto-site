import { buildWhatsappLink } from "@/lib/utils";
import type { Configuracoes } from "@/types/database";

const BANCOS = [
  { icon: "🏦", nome: "Bradesco", desc: "Até 48x · taxas atrativas" },
  { icon: "🏦", nome: "Santander", desc: "Aprovação rápida" },
  { icon: "🏦", nome: "Banco BV", desc: "Até 48x · FGTS como entrada" },
  { icon: "✅", nome: "Omni +", desc: "Negativado também" },
];

const FEATURES = [
  {
    icon: "⚡",
    titulo: "Aprovação em minutos",
    desc: "Mandamos a proposta para múltiplos bancos ao mesmo tempo e escolhemos a melhor condição pra você.",
  },
  {
    icon: "💰",
    titulo: "FGTS como entrada",
    desc: "Pelo Banco Pan, você pode usar o saldo do Saque-Aniversário do FGTS como entrada. Pergunta pra gente como funciona.",
  },
  {
    icon: "🔄",
    titulo: "Aceita sua moto na troca",
    desc: "Avaliamos sua moto na hora e abatemos no valor da nova. Sem precisar vender antes.",
  },
  {
    icon: "🛡️",
    titulo: "Negativado? Sem problema",
    desc: "Trabalhamos com a RMC, que aprova mesmo com restrição no CPF. Vem conversar com a gente.",
  },
];

export function Financiamento({ config }: { config: Configuracoes }) {
  const link = buildWhatsappLink(config.whatsapp, "Olá! Quero fazer uma simulação de financiamento.");

  return (
    <section className="border-y border-border bg-dark px-6 py-[72px]" id="financiamento">
      <div className="mx-auto grid max-w-[1100px] items-center gap-16 md:grid-cols-2">
        <div>
          <div className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[3px] text-orange">
            💳 Sem burocracia
          </div>
          <h2 className="mb-5 font-display text-[clamp(36px,5vw,56px)] font-black uppercase leading-[0.95] tracking-[-0.5px]">
            Financiamento
            <br />
            <span className="text-orange">Aprovado</span>
            <br />
            Na Hora
          </h2>
          <p className="mb-8 text-[15px] leading-[1.7] text-muted">
            Trabalhamos com os principais bancos do mercado. Simulação rápida, resposta na hora,
            sem enrolação.
          </p>
          <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {BANCOS.map((banco) => (
              <div
                key={banco.nome}
                className="flex items-center gap-2.5 rounded-[10px] border border-border bg-white/[0.04] px-4 py-3.5"
              >
                <div className="text-xl">{banco.icon}</div>
                <div>
                  <div className="text-[13px] font-semibold">{banco.nome}</div>
                  <div className="text-[11px] text-muted">{banco.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-orange px-6 py-[13px] text-sm font-bold text-white transition-[background,transform] hover:-translate-y-px hover:bg-orange-dark"
          >
            Simular financiamento agora
          </a>
        </div>
        <div className="flex flex-col gap-3.5">
          {FEATURES.map((f) => (
            <div
              key={f.titulo}
              className="flex items-start gap-3 rounded-[10px] border border-orange/15 bg-orange/[0.06] p-4"
            >
              <div className="shrink-0 text-[22px]">{f.icon}</div>
              <div>
                <div className="mb-0.5 text-sm font-bold">{f.titulo}</div>
                <div className="text-xs leading-[1.5] text-muted">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
