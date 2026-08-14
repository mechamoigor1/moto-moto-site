import { SITE_URL } from "@/lib/seo";
import type { Configuracoes, MotoComRelacoes } from "@/types/database";

export function schemaDealer(config: Configuracoes) {
  return {
    "@context": "https://schema.org",
    "@type": "MotorcycleDealer",
    "@id": `${SITE_URL}/#dealer`,
    name: config.nome_loja,
    url: SITE_URL,
    telephone: config.telefone_display,
    address: {
      "@type": "PostalAddress",
      streetAddress: config.endereco,
      addressLocality: "Paulínia",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    openingHours: [config.horario_semana, config.horario_sabado].filter(Boolean),
    sameAs: config.instagram ? [`https://instagram.com/${config.instagram}`] : undefined,
    hasMap: config.maps_url || undefined,
  };
}

export function schemaMotoProduct(moto: MotoComRelacoes) {
  const nome = `${moto.marca.nome} ${moto.modelo} ${moto.ano}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: nome,
    brand: { "@type": "Brand", name: moto.marca.nome },
    description: moto.descricao || undefined,
    image: moto.imagens.map((img) => img.url),
    itemCondition: "https://schema.org/UsedCondition",
    url: `${SITE_URL}/motos/${moto.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: moto.preco,
      availability:
        moto.status === "disponivel"
          ? "https://schema.org/InStock"
          : moto.status === "reservada"
            ? "https://schema.org/LimitedAvailability"
            : "https://schema.org/SoldOut",
      url: `${SITE_URL}/motos/${moto.slug}`,
    },
  };
}

export function schemaBreadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
