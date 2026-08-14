import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { buildWhatsappLink } from "@/lib/utils";
import type { Configuracoes } from "@/types/database";

export function CtaFinal({ config }: { config: Configuracoes }) {
  const link = buildWhatsappLink(config.whatsapp, "Olá! Vim pelo site e quero saber mais sobre as motos.");

  return (
    <section className="border-t border-border bg-gradient-to-br from-orange/12 to-transparent px-6 py-20 text-center">
      <div className="mx-auto max-w-[600px]">
        <h2 className="mb-4 font-display text-[clamp(36px,6vw,56px)] font-black uppercase leading-[0.95] tracking-[-1px]">
          Já encontrou sua próxima moto?
        </h2>
        <p className="mb-8 text-[15px] text-muted">
          Fale com a Moto Moto pelo WhatsApp. Tire suas dúvidas, simule o financiamento, envie sua
          moto para avaliação ou consulte a disponibilidade de qualquer modelo do estoque.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-orange px-8 py-[15px] text-base font-bold text-white transition-[background,transform] hover:-translate-y-px hover:bg-orange-dark"
          >
            <Icon name="whatsapp" className="h-4 w-4 fill-white" /> Falar com a Moto Moto
          </a>
          <Link
            href="/motos"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-[13px] text-sm font-semibold text-white transition-[border-color,transform] hover:-translate-y-px hover:border-white/25"
          >
            Continuar vendo as motos
          </Link>
        </div>
      </div>
    </section>
  );
}
