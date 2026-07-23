import Link from "next/link";
import { buildWhatsappLink } from "@/lib/utils";
import type { Configuracoes } from "@/types/database";

export function Header({ config }: { config: Configuracoes }) {
  const palavras = config.nome_loja.split(" ");
  const destaque = palavras.pop() ?? "";
  const prefixo = palavras.join(" ");

  const linkWhatsapp = buildWhatsappLink(
    config.whatsapp,
    "Olá! Vim pelo site e quero saber mais sobre as motos."
  );

  return (
    <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between border-b border-border bg-black/95 px-6 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2.5">
        <div>
          <div className="font-display text-xl font-black leading-none tracking-wide text-white">
            {prefixo} <span className="text-orange">{destaque}</span>
          </div>
          <div className="text-[10px] font-medium uppercase tracking-[1.5px] text-muted">
            {config.cidade_estado}
          </div>
        </div>
      </Link>
      <div className="hidden items-center gap-6 md:flex">
        <Link href="/motos" className="text-[13px] font-medium text-muted transition-colors hover:text-white">
          Catálogo
        </Link>
        <Link href="/#financiamento" className="text-[13px] font-medium text-muted transition-colors hover:text-white">
          Financiamento
        </Link>
        <Link href="/#sobre" className="text-[13px] font-medium text-muted transition-colors hover:text-white">
          Sobre
        </Link>
        <Link href="/contato" className="text-[13px] font-medium text-muted transition-colors hover:text-white">
          Contato
        </Link>
        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-orange px-[18px] py-2 text-[13px] font-semibold text-white transition-colors hover:bg-orange-dark"
        >
          📲 Falar no WhatsApp
        </a>
      </div>
    </nav>
  );
}
