import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFloat } from "@/components/public/WhatsAppFloat";
import { getConfiguracoes } from "@/lib/data/configuracoes";

// Dados administrados diretamente no Supabase devem aparecer sem aguardar ISR.
export const revalidate = 0;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getConfiguracoes();

  return (
    <div className="flex min-h-screen flex-col">
      <Header config={config} />
      <main className="flex-1">{children}</main>
      <Footer config={config} />
      <WhatsAppFloat config={config} />
    </div>
  );
}
