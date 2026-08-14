import { Hero } from "@/components/public/Hero";
import { Diferenciais } from "@/components/public/Diferenciais";
import { MarcasBar } from "@/components/public/MarcasBar";
import { CatalogoSection } from "@/components/public/CatalogoSection";
import { Financiamento } from "@/components/public/Financiamento";
import { Sobre } from "@/components/public/Sobre";
import { CtaFinal } from "@/components/public/CtaFinal";
import { SupabaseSetupNotice } from "@/components/public/SupabaseSetupNotice";
import { JsonLd } from "@/components/public/JsonLd";
import { getMotosPublicadas } from "@/lib/data/motos";
import { getMarcas } from "@/lib/data/marcas";
import { getConfiguracoes } from "@/lib/data/configuracoes";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { schemaDealer } from "@/lib/schema";

// ISR curto: dados do painel já invalidam via revalidatePath ao salvar;
// isso só cobre edições feitas direto no Supabase, fora do app.
export const revalidate = 60;

export default async function HomePage() {
  const [config, motos, marcas] = await Promise.all([
    getConfiguracoes(),
    getMotosPublicadas(),
    getMarcas(),
  ]);

  return (
    <>
      <JsonLd data={schemaDealer(config)} />
      {!isSupabaseConfigured && <SupabaseSetupNotice />}
      <Hero config={config} marcas={marcas} />
      <Diferenciais />
      <MarcasBar marcas={marcas} />
      <div className="mx-auto max-w-[1100px] px-6 pt-12">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[3px] text-orange">Catálogo</div>
        <h2 className="mb-3 font-display text-[clamp(28px,4vw,40px)] font-black uppercase leading-[0.95] tracking-[-0.5px]">
          Encontre a moto que combina com você
        </h2>
        <p className="max-w-[560px] text-[15px] leading-[1.7] text-muted">
          Escolha por marca, modelo e faixa de preço. Encontrou uma que gostou? Fale direto com a
          nossa equipe pelo WhatsApp.
        </p>
      </div>
      <CatalogoSection motos={motos} marcas={marcas} whatsapp={config.whatsapp} />
      <Financiamento config={config} />
      <Sobre config={config} />
      <CtaFinal config={config} />
    </>
  );
}
