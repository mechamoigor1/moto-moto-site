import Link from "next/link";
import { buildWhatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/public/WhatsAppFloat";
import type { Configuracoes, Marca } from "@/types/database";

export function Hero({
  config,
  totalMotos,
  marcas,
}: {
  config: Configuracoes;
  totalMotos: number;
  marcas: Marca[];
}) {
  const linkCatalogo = buildWhatsappLink(config.whatsapp, "Olá! Quero simular um financiamento.");

  return (
    <section className="mx-auto grid max-w-[1100px] items-center gap-10 px-5 pb-10 pt-12 md:grid-cols-2 md:gap-12 md:px-6 md:pb-16 md:pt-[72px]">
      <div>
        <div className="mb-5 inline-block rounded-full border border-orange/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[3px] text-orange">
          🏍️ {config.cidade_estado}
        </div>
        <h1 className="mb-5 font-display text-[clamp(48px,6vw,76px)] font-black uppercase leading-[0.95] tracking-[-1px]">
          Motos
          <br />
          Seminovas
          <br />
          Com <span className="text-orange">Garantia</span>
        </h1>
        <p className="mb-8 max-w-[440px] text-[15px] leading-[1.7] text-muted">
          {totalMotos}+ motos disponíveis. Todas revisadas, com laudo cautelar e garantia de 90
          dias. Financiamento aprovado na hora — negativado também.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/motos"
            className="inline-flex items-center gap-2 rounded-lg bg-orange px-6 py-[13px] text-sm font-bold text-white transition-[background,transform] hover:-translate-y-px hover:bg-orange-dark"
          >
            Ver catálogo completo
          </Link>
          <a
            href={linkCatalogo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-[13px] text-sm font-semibold text-white transition-[border-color,transform] hover:-translate-y-px hover:border-white/25"
          >
            <WhatsAppIcon className="h-4 w-4 fill-green" />
            Simular financiamento
          </a>
        </div>
      </div>
      <div className="hidden grid-cols-2 gap-4 md:grid">
        <div className="col-span-2 rounded-xl border border-orange/20 bg-gradient-to-br from-orange/15 to-orange/5 p-6 px-5">
          <div className="font-display text-5xl font-black leading-none text-orange">
            {totalMotos}+
          </div>
          <div className="mt-1 text-xs tracking-wide text-muted">motos em estoque agora</div>
          <div className="mt-2 text-[13px] text-white/70">
            {marcas.map((m) => m.nome).join(" · ")}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 px-5">
          <div className="font-display text-5xl font-black leading-none text-orange">90</div>
          <div className="mt-1 text-xs tracking-wide text-muted">dias de garantia</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 px-5">
          <div className="font-display text-5xl font-black leading-none text-orange">4</div>
          <div className="mt-1 text-xs tracking-wide text-muted">bancos parceiros</div>
        </div>
      </div>
    </section>
  );
}
