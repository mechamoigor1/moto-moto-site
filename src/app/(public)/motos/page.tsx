import type { Metadata } from "next";
import { CatalogoSection } from "@/components/public/CatalogoSection";
import { SupabaseSetupNotice } from "@/components/public/SupabaseSetupNotice";
import { getMotosPublicadas } from "@/lib/data/motos";
import { getMarcas } from "@/lib/data/marcas";
import { getConfiguracoes } from "@/lib/data/configuracoes";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Catálogo de Motos",
  description: "Confira todas as motos seminovas disponíveis, com filtros por marca e preço.",
};

export const revalidate = 3600;

export default async function MotosPage() {
  const [config, motos, marcas] = await Promise.all([
    getConfiguracoes(),
    getMotosPublicadas(),
    getMarcas(),
  ]);

  return (
    <>
      {!isSupabaseConfigured && <SupabaseSetupNotice />}
      <div className="mx-auto max-w-[1100px] px-6 pt-12">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[3px] text-orange">
          Catálogo completo
        </div>
        <h1 className="font-display text-[clamp(36px,5vw,52px)] font-black uppercase leading-[0.95] tracking-[-0.5px]">
          Todas As <span className="text-orange">Motos</span>
        </h1>
      </div>
      <CatalogoSection motos={motos} marcas={marcas} whatsapp={config.whatsapp} />
    </>
  );
}
