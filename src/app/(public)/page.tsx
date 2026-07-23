import { Hero } from "@/components/public/Hero";
import { Diferenciais } from "@/components/public/Diferenciais";
import { CatalogoSection } from "@/components/public/CatalogoSection";
import { Financiamento } from "@/components/public/Financiamento";
import { Sobre } from "@/components/public/Sobre";
import { CtaFinal } from "@/components/public/CtaFinal";
import { SupabaseSetupNotice } from "@/components/public/SupabaseSetupNotice";
import { getMotosPublicadas } from "@/lib/data/motos";
import { getMarcas } from "@/lib/data/marcas";
import { getConfiguracoes } from "@/lib/data/configuracoes";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const revalidate = 3600;

export default async function HomePage() {
  const [config, motos, marcas] = await Promise.all([
    getConfiguracoes(),
    getMotosPublicadas(),
    getMarcas(),
  ]);

  return (
    <>
      {!isSupabaseConfigured && <SupabaseSetupNotice />}
      <Hero config={config} totalMotos={motos.length} marcas={marcas} />
      <Diferenciais />
      <CatalogoSection motos={motos} marcas={marcas} whatsapp={config.whatsapp} />
      <Financiamento config={config} />
      <Sobre config={config} />
      <CtaFinal config={config} />
    </>
  );
}
