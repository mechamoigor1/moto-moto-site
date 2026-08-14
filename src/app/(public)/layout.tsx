import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFloat } from "@/components/public/WhatsAppFloat";
import { getConfiguracoes } from "@/lib/data/configuracoes";

// revalidate=0 forçava SSR dinâmico em toda navegação (server + Supabase em
// cada request). ISR curto mantém a mesma frescor prática — edições feitas
// pelo painel já invalidam via revalidatePath — e permite cache de borda.
export const revalidate = 60;

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
