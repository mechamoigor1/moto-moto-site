import Image from "next/image";
import Link from "next/link";
import type { Marca } from "@/types/database";

const LOGOS_POR_SLUG: Record<string, string> = {
  honda: "/brand/marcas/honda.svg",
  yamaha: "/brand/marcas/yamaha.svg",
  suzuki: "/brand/marcas/suzuki.svg",
  triumph: "/brand/marcas/triumph.svg",
};

export function MarcasBar({ marcas }: { marcas: Marca[] }) {
  const marcasComLogo = marcas.filter((marca) => LOGOS_POR_SLUG[marca.slug]);

  if (marcasComLogo.length === 0) return null;

  return (
    <div className="border-b border-border bg-white px-6 py-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-5 text-center text-[11px] font-bold uppercase tracking-[3px] text-black/50">
          Trabalhamos com as principais marcas
        </div>
        <div className="flex flex-nowrap items-center justify-between gap-4 md:justify-center md:gap-16">
          {marcasComLogo.map((marca) => (
            <Link
              key={marca.id}
              href={`/marcas/${marca.slug}`}
              aria-label={`Ver motos ${marca.nome}`}
              className="flex h-12 w-16 shrink items-center justify-center transition-transform hover:-translate-y-1 md:h-16 md:w-24"
            >
              <Image
                src={LOGOS_POR_SLUG[marca.slug]}
                alt={marca.nome}
                width={96}
                height={64}
                className="h-full w-full object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
