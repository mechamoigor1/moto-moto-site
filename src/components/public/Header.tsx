"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Icon } from "@/components/ui/Icon";
import { getMobileHeaderState } from "@/components/public/header-state";
import { buildWhatsappLink } from "@/lib/utils";
import type { Configuracoes } from "@/types/database";

const navigationLinks = [
  { href: "/", label: "Início" },
  { href: "/motos", label: "Catálogo" },
  { href: "/#financiamento", label: "Financiamento" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Header({ config }: { config: Configuracoes }) {
  const [mobileHeaderState, setMobileHeaderState] = useState<"expanded" | "compact">("expanded");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateHeaderState = () => {
      const nextState = getMobileHeaderState(window.scrollY);
      setMobileHeaderState(nextState);

      if (nextState === "compact") {
        setMobileMenuOpen(false);
      }
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const linkWhatsapp = buildWhatsappLink(
    config.whatsapp,
    "Olá! Vim pelo site e quero saber mais sobre as motos."
  );

  return (
    <header className="relative z-[100]">
      <div aria-hidden="true" className="h-[68px] md:h-[84px]" />
      <div
        className={`surface-glass fixed inset-x-0 top-0 z-10 border-x-0 transition-opacity duration-300 md:opacity-100 ${
          mobileHeaderState === "compact" ? "opacity-80" : "opacity-100"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1100px] items-center justify-between gap-4 px-4 md:h-[84px] md:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange md:hidden"
            >
              <Icon name="menu" className="h-5 w-5" />
              <span className="sr-only">Abrir menu de navegação</span>
            </button>

            <Link href="/" className="flex items-center" aria-label="Moto Moto - página inicial">
              <BrandLogo className="h-12 w-auto md:h-16" priority />
            </Link>
          </div>

          <ul className="hidden items-center gap-8 md:flex">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[13px] font-semibold text-muted transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={linkWhatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar no WhatsApp"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-orange px-3 text-[13px] font-semibold text-white transition-colors hover:bg-orange-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange md:px-4"
          >
            <Icon name="whatsapp" className="h-5 w-5" />
            <span className="md:hidden">WhatsApp</span>
            <span className="hidden md:inline">Falar no WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Mobile side drawer: blurred backdrop over the rest of the page + a black panel sliding in from the left */}
      <div className={`fixed inset-0 z-[120] md:hidden ${mobileMenuOpen ? "" : "pointer-events-none"}`}>
        <button
          type="button"
          aria-label="Fechar menu"
          tabIndex={mobileMenuOpen ? 0 : -1}
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className={`absolute inset-y-0 left-0 flex w-[78vw] max-w-[300px] flex-col bg-black shadow-2xl transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center"
              aria-label="Moto Moto - página inicial"
            >
              <BrandLogo className="h-11 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          <ul className="flex flex-col gap-1 px-3 py-4">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm font-semibold text-muted transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto border-t border-border p-4">
            <a
              href={linkWhatsapp}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-orange px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-dark"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
