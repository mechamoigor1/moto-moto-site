"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Icon, type IconName } from "@/components/ui/Icon";
import { sair } from "@/lib/actions/auth";

const LINKS: Array<{ href: string; label: string; icon: IconName; exact?: boolean }> = [
  { href: "/admin", label: "Dashboard", icon: "chart", exact: true },
  { href: "/admin/motos", label: "Motos", icon: "motorcycle" },
  { href: "/admin/marcas", label: "Marcas", icon: "tag" },
  { href: "/admin/categorias", label: "Categorias", icon: "folder" },
  { href: "/admin/contatos", label: "Contatos", icon: "mail" },
  { href: "/admin/configuracoes", label: "Configurações", icon: "settings" },
];

function NavLinks({ pathname, onNavegar }: { pathname: string; onNavegar?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {LINKS.map((link) => {
        const ativo = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavegar}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              ativo ? "bg-orange/15 text-orange" : "text-muted hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon name={link.icon} className="h-4 w-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function RodapeConta({ email }: { email: string | undefined }) {
  return (
    <div className="border-t border-border p-4">
      {email && <div className="mb-2 truncate text-xs text-muted">{email}</div>}
      <form action={sair}>
        <button
          type="submit"
          className="w-full rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-white/25 hover:text-white"
        >
          Sair
        </button>
      </form>
    </div>
  );
}

export function Sidebar({ email }: { email: string | undefined }) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  // Fecha o menu automaticamente ao navegar para outra página.
  useEffect(() => {
    setAberto(false);
  }, [pathname]);

  // Trava o scroll do fundo enquanto o menu mobile está aberto.
  useEffect(() => {
    if (!aberto) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, [aberto]);

  return (
    <>
      {/* Barra superior mobile, com o botão que abre o menu lateral */}
      <div className="flex items-center justify-between border-b border-border bg-dark px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <BrandLogo className="h-9 w-auto" priority />
          <span className="text-[11px] uppercase tracking-[1.5px] text-muted">Admin</span>
        </div>
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls="admin-drawer"
          onClick={() => setAberto(true)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          <Icon name="menu" className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </button>
      </div>

      {/* Sidebar fixa (desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-dark md:flex">
        <div className="border-b border-border p-5">
          <BrandLogo className="h-12 w-auto" priority />
          <div className="mt-2 text-[11px] uppercase tracking-[1.5px] text-muted">Admin</div>
        </div>
        <NavLinks pathname={pathname} />
        <RodapeConta email={email} />
      </aside>

      {/* Menu lateral recolhível (mobile): fundo com blur + painel que desliza da esquerda */}
      <div className={`fixed inset-0 z-[120] md:hidden ${aberto ? "" : "pointer-events-none"}`}>
        <button
          type="button"
          aria-label="Fechar menu"
          tabIndex={aberto ? 0 : -1}
          onClick={() => setAberto(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            aberto ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          id="admin-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu administrativo"
          className={`absolute inset-y-0 left-0 flex w-[78vw] max-w-[280px] flex-col bg-dark shadow-2xl transition-transform duration-300 ${
            aberto ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <BrandLogo className="h-11 w-auto" />
              <div className="mt-2 text-[11px] uppercase tracking-[1.5px] text-muted">Admin</div>
            </div>
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar menu"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
          <NavLinks pathname={pathname} onNavegar={() => setAberto(false)} />
          <RodapeConta email={email} />
        </div>
      </div>
    </>
  );
}
