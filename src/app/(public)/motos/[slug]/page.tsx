import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GaleriaFotos } from "@/components/public/GaleriaFotos";
import { JsonLd } from "@/components/public/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { getMotoBySlug } from "@/lib/data/motos";
import { getConfiguracoes } from "@/lib/data/configuracoes";
import { formatKm, formatPreco, buildWhatsappLink, mensagemInteresseMoto } from "@/lib/utils";
import { schemaMotoProduct, schemaBreadcrumb } from "@/lib/schema";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const moto = await getMotoBySlug(slug);
  if (!moto) return { title: "Moto não encontrada" };

  const nome = `${moto.marca.nome} ${moto.modelo} ${moto.ano}`;
  const statusTitulo = moto.status === "vendida" ? "Vendida" : "Seminova em Paulínia";
  const titulo = `${nome} ${statusTitulo}`;
  const descricao = `${nome} seminova em Paulínia, com ${formatKm(moto.km)}, por ${formatPreco(moto.preco)}. Confira fotos, detalhes e fale com a loja no WhatsApp.`;

  return {
    title: titulo,
    description: descricao,
    alternates: {
      canonical: `/motos/${moto.slug}`,
    },
    openGraph: {
      title: titulo,
      description: descricao,
      url: `/motos/${moto.slug}`,
      images: moto.imagens[0] ? [moto.imagens[0].url] : undefined,
    },
  };
}

const STATUS_LABEL: Record<string, string> = {
  reservada: "Reservada",
  vendida: "Vendida",
};

export default async function MotoDetalhePage({ params }: Props) {
  const { slug } = await params;
  const [moto, config] = await Promise.all([getMotoBySlug(slug), getConfiguracoes()]);

  if (!moto) notFound();

  const nomeCompleto = `${moto.marca.nome} ${moto.modelo} ${moto.ano}`;
  const linkWpp = buildWhatsappLink(config.whatsapp, mensagemInteresseMoto(nomeCompleto, moto.preco));
  const specsExtras = Object.entries(moto.specs).filter(
    ([chave, valor]) => valor && !["cor", "cilindrada"].includes(chave)
  );

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-10">
      <JsonLd data={schemaMotoProduct(moto)} />
      <JsonLd
        data={schemaBreadcrumb([
          { name: "Catálogo", url: "/motos" },
          { name: moto.marca.nome, url: `/marcas/${moto.marca.slug}` },
          { name: `${moto.modelo} ${moto.ano}`, url: `/motos/${moto.slug}` },
        ])}
      />
      <nav className="mb-6 flex gap-2 text-xs text-muted">
        <Link href="/motos" className="hover:text-white">
          Catálogo
        </Link>
        <span>/</span>
        <Link href={`/marcas/${moto.marca.slug}`} className="hover:text-white">
          {moto.marca.nome}
        </Link>
        <span>/</span>
        <span className="text-white/70">
          {moto.modelo} {moto.ano}
        </span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <GaleriaFotos imagens={moto.imagens} nome={nomeCompleto} />

        <div>
          {moto.status !== "disponivel" && (
            <div className="mb-3 inline-block rounded-full bg-[#555] px-3 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-white">
              {STATUS_LABEL[moto.status] ?? moto.status}
            </div>
          )}
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[2.5px] text-orange">
            {moto.marca.nome}
          </div>
          <h1 className="mb-4 font-display text-[clamp(36px,5vw,52px)] font-black uppercase leading-[0.95]">
            {moto.modelo} {moto.ano}
          </h1>

          <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Icon name="gauge" className="h-4 w-4 shrink-0" />
              {formatKm(moto.km)}
            </span>
            {moto.specs.cor && (
              <span className="flex items-center gap-1.5">
                <Icon name="palette" className="h-4 w-4 shrink-0" />
                {moto.specs.cor}
              </span>
            )}
            {moto.specs.cilindrada && (
              <span className="flex items-center gap-1.5">
                <Icon name="settings" className="h-4 w-4 shrink-0" />
                {moto.specs.cilindrada}
              </span>
            )}
            {specsExtras.map(([chave, valor]) => (
              <span key={chave} className="capitalize">
                {chave}: {valor}
              </span>
            ))}
          </div>

          <div className="mb-6 rounded-2xl border border-border bg-card p-6">
            <div className="mb-1 text-xs text-muted">por apenas</div>
            <div className="mb-5 font-display text-5xl font-black leading-none">
              {formatPreco(moto.preco)}
            </div>
            <a
              href={linkWpp}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-green px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-[0.9]"
            >
              <Icon name="whatsapp" className="h-4 w-4 fill-white" />
              Tenho interesse — falar no WhatsApp
            </a>
          </div>

          {moto.descricao && (
            <div className="prose prose-invert max-w-none text-sm leading-relaxed text-white/80">
              {moto.descricao.split("\n").map((par, i) => (
                <p key={i} className="mb-3">
                  {par}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
