import Link from "next/link";
import type { Configuracoes } from "@/types/database";

export function Footer({ config }: { config: Configuracoes }) {
  const palavras = config.nome_loja.split(" ");
  const destaque = palavras.pop() ?? "";
  const prefixo = palavras.join(" ");

  return (
    <footer className="border-t border-border bg-dark px-6 py-8">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4">
        <div className="font-display text-lg font-black tracking-wide">
          {prefixo} <span className="text-orange">{destaque}</span>
        </div>
        <div className="text-xs text-muted">
          {config.endereco} — {config.cidade_estado} · {config.telefone_display}
        </div>
        <div className="flex gap-5">
          <Link href="/motos" className="text-xs text-muted hover:text-white">
            Catálogo
          </Link>
          <Link href="/#financiamento" className="text-xs text-muted hover:text-white">
            Financiamento
          </Link>
          <a
            href={`https://instagram.com/${config.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted hover:text-white"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
