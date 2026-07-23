import type { Configuracoes } from "@/types/database";

const ITENS = [
  "Mais de 25 motos sempre em estoque",
  "Honda, Yamaha, Triumph, Suzuki e mais",
  "Oficina própria no mesmo local",
  "Laudo cautelar em todas as motos",
  "Garantia de 90 dias no motor e câmbio",
  "Atendimento com o dono, sem enrolação",
];

export function Sobre({ config }: { config: Configuracoes }) {
  return (
    <section className="mx-auto grid max-w-[1100px] items-center gap-16 px-6 py-[72px] md:grid-cols-2" id="sobre">
      <div>
        <div className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[3px] text-orange">
          📍 {config.cidade_estado}
        </div>
        <h2 className="mb-5 font-display text-[clamp(36px,5vw,52px)] font-black uppercase leading-[0.95] tracking-[-0.5px]">
          Quem
          <br />
          Somos <span className="text-orange">Nós</span>
        </h2>
        <p className="mb-7 text-[15px] leading-[1.7] text-muted">
          A {config.nome_loja} é uma loja multimarcas de motos seminovas no centro da cidade. O
          negócio é fechado com aperto de mão — atendimento direto com o dono, sem intermediários.
        </p>
        <ul className="flex flex-col gap-2.5">
          {ITENS.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-white/85">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-hidden rounded-[14px] border border-border bg-card">
        <div className="border-b border-border p-5 px-6">
          <div className="mb-1 text-[15px] font-bold">{config.nome_loja}</div>
          <div className="text-[13px] text-muted">
            {config.endereco} — {config.cidade_estado}
          </div>
        </div>
        <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 bg-[#111] p-6">
          <div className="text-3xl">📍</div>
          <div className="text-center text-[13px] leading-[1.6] text-muted">
            {config.endereco}
            <br />
            {config.cidade_estado}
          </div>
          <a
            href={config.maps_url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-2 rounded-lg bg-orange px-5 py-2.5 text-[13px] font-bold text-white"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-white" strokeWidth={2}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Abrir no Google Maps
          </a>
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
