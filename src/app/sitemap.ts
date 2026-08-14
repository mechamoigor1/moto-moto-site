import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getMotosPublicadas } from "@/lib/data/motos";
import { getMarcas } from "@/lib/data/marcas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [motos, marcas] = await Promise.all([getMotosPublicadas(), getMarcas()]);

  const paginasEstaticas: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/motos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/contato`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const paginasMarcas: MetadataRoute.Sitemap = marcas.map((marca) => ({
    url: `${SITE_URL}/marcas/${marca.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const paginasMotos: MetadataRoute.Sitemap = motos.map((moto) => ({
    url: `${SITE_URL}/motos/${moto.slug}`,
    lastModified: moto.updated_at ? new Date(moto.updated_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...paginasEstaticas, ...paginasMarcas, ...paginasMotos];
}
