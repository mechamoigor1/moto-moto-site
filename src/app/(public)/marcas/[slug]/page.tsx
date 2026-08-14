import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogoSection } from "@/components/public/CatalogoSection";
import { getMotosPublicadas } from "@/lib/data/motos";
import { getMarcaBySlug, getMarcas } from "@/lib/data/marcas";
import { getConfiguracoes } from "@/lib/data/configuracoes";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const marca = await getMarcaBySlug(slug);
  if (!marca) return { title: "Marca não encontrada" };
  const titulo = `Motos ${marca.nome} Seminovas em Paulínia`;
  const descricao = `Motos ${marca.nome} seminovas em Paulínia, SP, com garantia e financiamento. Confira o estoque atualizado da Moto Moto.`;
  return {
    title: titulo,
    description: descricao,
    alternates: {
      canonical: `/marcas/${marca.slug}`,
    },
    openGraph: {
      title: titulo,
      description: descricao,
      url: `/marcas/${marca.slug}`,
    },
  };
}

export default async function MarcaPage({ params }: Props) {
  const { slug } = await params;
  const [marca, config, motos, marcas] = await Promise.all([
    getMarcaBySlug(slug),
    getConfiguracoes(),
    getMotosPublicadas({ marcaSlug: slug }),
    getMarcas(),
  ]);

  if (!marca) notFound();

  return (
    <>
      <div className="mx-auto max-w-[1100px] px-6 pt-12">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[3px] text-orange">Marca</div>
        <h1 className="font-display text-[clamp(36px,5vw,52px)] font-black uppercase leading-[0.95] tracking-[-0.5px]">
          Motos <span className="text-orange">{marca.nome}</span>
        </h1>
      </div>
      <CatalogoSection motos={motos} marcas={marcas} whatsapp={config.whatsapp} marcaFixa={slug} />
    </>
  );
}
