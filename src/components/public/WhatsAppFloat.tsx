import { Icon } from "@/components/ui/Icon";
import { buildWhatsappLink } from "@/lib/utils";
import type { Configuracoes } from "@/types/database";

export function WhatsAppFloat({ config }: { config: Configuracoes }) {
  const link = buildWhatsappLink(
    config.whatsapp,
    `Olá! Vim pelo site da ${config.nome_loja}.`
  );

  return (
    <a
      className="fixed bottom-6 right-6 z-[200] flex h-14 w-14 items-center justify-center rounded-full bg-green shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-transform hover:scale-[1.08] hover:shadow-[0_6px_28px_rgba(37,211,102,0.5)]"
      href={link}
      target="_blank"
      rel="noreferrer"
      title="Falar no WhatsApp"
    >
      <Icon name="whatsapp" className="h-7 w-7 fill-white" />
    </a>
  );
}
