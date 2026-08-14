import type { Metadata } from "next";
import { FormularioContato } from "@/components/public/FormularioContato";
import { Icon } from "@/components/ui/Icon";
import { buildWhatsappLink } from "@/lib/utils";
import { getConfiguracoes } from "@/lib/data/configuracoes";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Moto Moto Paulínia pelo WhatsApp, telefone ou formulário de contato.",
  alternates: { canonical: "/contato" },
};

export default async function ContatoPage() {
  const config = await getConfiguracoes();
  const linkWpp = buildWhatsappLink(config.whatsapp, "Olá! Vim pelo site e quero saber mais sobre as motos.");

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-14">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[3px] text-orange">Contato</div>
      <h1 className="mb-10 font-display text-[clamp(36px,5vw,52px)] font-black uppercase leading-[0.95] tracking-[-0.5px]">
        Fala Com <span className="text-orange">A Gente</span>
      </h1>

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <p className="mb-6 text-[15px] leading-[1.7] text-muted">
            Prefere resposta na hora? Chama direto no WhatsApp. Se preferir, deixa seus dados no
            formulário que a gente te retorna.
          </p>
          <a
            href={linkWpp}
            target="_blank"
            rel="noreferrer"
            className="mb-8 inline-flex items-center gap-2 rounded-lg bg-green px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-[0.9]"
          >
            <Icon name="whatsapp" className="h-4 w-4 fill-white" />
            Falar no WhatsApp
          </a>

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-sm text-muted">
            <div>
              <span className="text-white">{config.nome_loja}</span>
              <br />
              {config.endereco} — {config.cidade_estado}
            </div>
            <div>{config.telefone_display}</div>
            <div>
              {config.horario_semana} · {config.horario_sabado}
            </div>
            <a
              href={`https://instagram.com/${config.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="text-orange hover:underline"
            >
              @{config.instagram}
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <FormularioContato />
        </div>
      </div>
    </div>
  );
}
