import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Configuracoes } from "@/types/database";

const ITENS = [
  "Motos revisadas",
  "Laudo cautelar",
  "90 dias de garantia",
  "Oficina própria",
  "Aceitamos sua moto na troca",
  "Atendimento direto",
];

export function Sobre({ config }: { config: Configuracoes }) {
  return (
    <section className="mx-auto grid max-w-[1100px] items-center gap-16 px-6 py-[72px] md:grid-cols-2" id="sobre">
      <div>
        <div className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[3px] text-orange">
          {config.nome_loja}
        </div>
        <h2 className="mb-5 font-display text-[clamp(30px,4.5vw,44px)] font-black uppercase leading-[1.05] tracking-[-0.5px]">
          Aqui você sabe a moto que está levando.
        </h2>
        <p className="mb-4 text-[15px] leading-[1.7] text-muted">
          Comprar uma seminova não precisa ser uma aposta.
        </p>
        <p className="mb-4 text-[15px] leading-[1.7] text-muted">
          Na {config.nome_loja}, cada moto passa por avaliação, laudo cautelar e revisão antes de
          entrar no estoque.
        </p>
        <p className="mb-4 text-[15px] leading-[1.7] text-muted">
          E se precisar depois da compra, nossa oficina funciona no mesmo local.
        </p>
        <p className="mb-7 text-[15px] leading-[1.7] text-muted">
          Tudo com atendimento direto, negociação simples e sem enrolação.
        </p>
        <ul className="flex flex-col gap-2.5">
          {ITENS.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-white/85">
              <Icon name="check" className="h-4 w-4 shrink-0 text-orange" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-hidden rounded-[14px] border border-border bg-card">
        <div className="flex flex-col items-center gap-2 border-b border-border p-5 px-6 text-center">
          <Image
            src="/android-chrome-512x512.png"
            alt={config.nome_loja}
            width={44}
            height={44}
            className="h-11 w-11"
          />
          <div className="text-[13px] text-muted">
            {config.endereco} — {config.cidade_estado}
          </div>
        </div>
        <div className="bg-[#111]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29436.031076013347!2d-47.17474680143061!3d-22.74667423362826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8958afeb21269%3A0x85e860959bbe75a9!2sMoto%20Moto%20Venda%20De%20Motos%20e%20Servi%C3%A7os%20Mec%C3%A2nicos!5e0!3m2!1spt-BR!2sbr!4v1786721385389!5m2!1spt-BR!2sbr"
            width="100%"
            height="220"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title={`Mapa — ${config.nome_loja}`}
          />
          <div className="flex flex-col items-center gap-2 p-4">
            <a
              href={config.maps_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-orange px-5 py-2.5 text-[13px] font-bold text-white"
            >
              <Icon name="map-pin" className="h-3.5 w-3.5 text-white" />
              Como chegar
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 px-6">
          <div className="flex items-center gap-2 text-[13px] text-muted">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-orange" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {config.horario_semana} · {config.horario_sabado}
          </div>
          <div className="flex items-center gap-2 text-[13px] text-muted">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-orange" strokeWidth={2}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.58 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {config.telefone_display}
          </div>
          <div className="flex items-center gap-2 text-[13px] text-muted">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-orange" strokeWidth={2}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            @{config.instagram}
          </div>
        </div>
      </div>
    </section>
  );
}
