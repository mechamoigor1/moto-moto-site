import Image from "next/image";
import { buildWhatsappLink } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Configuracoes } from "@/types/database";

const BANCOS: { logo: string; nome: string; desc: string }[] = [
  { logo: "/brand/bancos/bradesco.svg", nome: "Bradesco", desc: "Até 48x · taxas atrativas" },
  { logo: "/brand/bancos/santander.svg", nome: "Santander", desc: "Aprovação rápida" },
  { logo: "/brand/bancos/bv.svg", nome: "Banco BV", desc: "Até 48x · FGTS como entrada" },
  { logo: "/brand/bancos/omni.svg", nome: "Omni +", desc: "Negativado também" },
];

const FEATURES: { icon: IconName; titulo: string; desc: string }[] = [
  {
    icon: "bolt",
    titulo: "Simulação rápida",
    desc: "Envie seus dados e consulte as condições disponíveis.",
  },
  {
    icon: "landmark",
    titulo: "Vários bancos parceiros",
    desc: "Mais possibilidades para encontrar uma boa condição.",
  },
  {
    icon: "repeat",
    titulo: "Sua moto pode ser a entrada",
    desc: "Avaliamos sua moto e usamos o valor na negociação.",
  },
  {
    icon: "shield-check",
    titulo: "Também analisamos opções para negativados",
    desc: "Consulte as condições disponíveis para o seu perfil.",
  },
];

export function Financiamento({ config }: { config: Configuracoes }) {
  const link = buildWhatsappLink(config.whatsapp, "Olá! Quero fazer uma simulação de financiamento.");

  return (
    <section className="border-y border-border bg-dark px-6 py-[72px]" id="financiamento">
      <div className="mx-auto grid max-w-[1100px] items-center gap-16 md:grid-cols-2">
        <div>
          <div className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[3px] text-orange">
            <Icon name="wallet" className="mr-1 inline h-3.5 w-3.5" /> Financiamento sem enrolação
          </div>
          <h2 className="mb-5 font-display text-[clamp(32px,5vw,48px)] font-black uppercase leading-[1.05] tracking-[-0.5px]">
            Simule e encontre uma condição que cabe no seu bolso
          </h2>
          <p className="mb-2 text-[15px] leading-[1.7] text-muted">
            Trabalhamos com diferentes instituições financeiras para buscar as melhores condições
            disponíveis para o seu perfil.
          </p>
          <p className="mb-8 text-[15px] leading-[1.7] text-muted">
            Faça sua simulação, receba as opções e escolha a que fizer mais sentido para você.
          </p>
          <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {BANCOS.map((banco) => (
              <div
                key={banco.nome}
                className="flex items-center gap-3 rounded-[10px] border border-border bg-white px-4 py-3"
              >
                <span className="flex h-9 w-14 shrink-0 items-center justify-center">
                  <Image
                    src={banco.logo}
                    alt={banco.nome}
                    width={56}
                    height={36}
                    className="h-full w-full object-contain"
                  />
                </span>
                <div>
                  <div className="text-[13px] font-semibold text-black">{banco.nome}</div>
                  <div className="text-[11px] text-black/55">{banco.desc}</div>
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
            Quero simular meu financiamento
          </a>
          <p className="mt-3 text-xs italic text-muted">
            Crédito sujeito à análise e aprovação da instituição financeira.
          </p>
        </div>
        <div className="flex flex-col gap-3.5">
          {FEATURES.map((f) => (
            <div
              key={f.titulo}
              className="flex items-start gap-3 rounded-[10px] border border-orange/15 bg-orange/[0.06] p-4"
            >
              <Icon name={f.icon} className="h-[22px] w-[22px] shrink-0 text-orange" />
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
