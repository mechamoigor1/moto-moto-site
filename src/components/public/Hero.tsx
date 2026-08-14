import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { buildWhatsappLink } from "@/lib/utils";
import type { Configuracoes, Marca } from "@/types/database";

export function Hero({
  config,
  marcas,
}: {
  config: Configuracoes;
  marcas: Marca[];
}) {
  const linkCatalogo = buildWhatsappLink(config.whatsapp, "Olá! Quero simular um financiamento.");

  return (
    <section className="relative overflow-hidden px-5 pb-12 pt-12 md:px-6 md:pb-16 md:pt-[72px]">
      <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-2 md:gap-12">
        <div className="order-2 md:order-1">
          <div className="mb-5 inline-block rounded-full border border-orange/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[3px] text-orange">
            Motos seminovas em Paulínia
          </div>
          <h1 className="mb-5 font-display text-[clamp(48px,6vw,76px)] font-black uppercase leading-[0.95] tracking-[-1px]">
            A Moto Certa.
            <br />
            <span className="text-orange">Sem Surpresa Depois.</span>
          </h1>
          <p className="mb-8 max-w-[440px] text-[15px] leading-[1.7] text-muted">
            Escolha sua próxima moto com mais segurança: seminovas revisadas em oficina própria,
            com laudo cautelar e 90 dias de garantia. Financie ou use sua moto na troca.
          </p>
          <div className="mb-4 flex flex-wrap gap-3">
            <Link
              href="/motos"
              className="inline-flex items-center gap-2 rounded-lg bg-orange px-6 py-[13px] text-sm font-bold text-white transition-[background,transform] hover:-translate-y-px hover:bg-orange-dark"
            >
              <Image
                src="/brand/moto-icon.png"
                alt=""
                aria-hidden="true"
                width={16}
                height={16}
                className="h-4 w-4 brightness-0 invert"
              />
              Ver motos disponíveis
            </Link>
            <a
              href={linkCatalogo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-[13px] text-sm font-semibold text-white transition-[border-color,transform] hover:-translate-y-px hover:border-white/25"
            >
              <Icon name="calculator" className="h-4 w-4" />
              Simular financiamento
            </a>
          </div>
          <p className="text-xs italic text-muted">
            Atendimento direto em Paulínia • Avaliação da sua moto na hora
          </p>
        </div>

        <div className="relative order-1 md:order-2">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full bg-orange/25 blur-[110px]"
          />
          <Image
            src="/moto-hero.webp"
            alt="Motociclista mascote da Moto Moto sobre uma moto"
            width={1107}
            height={1046}
            priority
            sizes="(min-width: 768px) 500px, 90vw"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>

      {marcas.length > 0 && (
        <p className="sr-only">Marcas disponíveis: {marcas.map((m) => m.nome).join(", ")}</p>
      )}
    </section>
  );
}
