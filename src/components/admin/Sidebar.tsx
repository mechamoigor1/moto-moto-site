"use client";

import Link from "next/link";
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

export function Sidebar({ email }: { email: string | undefined }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-dark">
      <div className="border-b border-border p-5">
        <BrandLogo className="h-12 w-auto" priority />
        <div className="mt-2 text-[11px] uppercase tracking-[1.5px] text-muted">Admin</div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {LINKS.map((link) => {
          const ativo = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
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
    </aside>
  );
}
