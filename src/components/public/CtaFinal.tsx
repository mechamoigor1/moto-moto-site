import Link from "next/link";
import { buildWhatsappLink } from "@/lib/utils";
import type { Configuracoes } from "@/types/database";

export function CtaFinal({ config }: { config: Configuracoes }) {
  const link = buildWhatsappLink(config.whatsapp, "Olá! Vim pelo site e quero saber mais sobre as motos.");

  return (
    <section className="border-t border-border bg-gradient-to-br from-orange/12 to-transparent px-6 py-20 text-center">
      <div className="mx-auto max-w-[600px]">
        <h2 className="mb-4 font-display text-[clamp(40px,6vw,64px)] font-black uppercase leading-[0.95] tracking-[-1px]">
          Achou A
          <br />
          Moto <span className="text-orange">Certa?</span>
        </h2>
        <p className="mb-8 text-[15px] text-muted">
          Chama no WhatsApp e a gente resolve tudo — simulação, financiamento e entrega. Sem sair
          de casa.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-orange px-8 py-[15px] text-base font-bold text-white transition-[background,transform] hover:-translate-y-px hover:bg-orange-dark"
          >
            📲 Falar no WhatsApp agora
          </a>
          <Link
            href="/motos"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-[13px] text-sm font-semibold text-white transition-[border-color,transform] hover:-translate-y-px hover:border-white/25"
          >
            Ver mais motos
          </Link>
        </div>
      </div>
    </section>
  );
}
