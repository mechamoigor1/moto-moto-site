const ITENS = [
  {
    icon: "✅",
    titulo: "Laudo Cautelar",
    desc: "100% aprovado em todas as motos do estoque",
  },
  {
    icon: "🏦",
    titulo: "Financiamento na hora",
    desc: "Bradesco, Santander, BV e Omni+ para negativados",
  },
  {
    icon: "🔄",
    titulo: "Aceita sua moto",
    desc: "Avaliação imediata e abatimento no valor",
  },
  {
    icon: "🔧",
    titulo: "Oficina própria",
    desc: "Revisão e serviços no mesmo local",
  },
];

export function Diferenciais() {
  return (
    <div className="border-y border-border bg-dark px-6 py-10">
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 md:grid-cols-4">
        {ITENS.map((item, i) => (
          <div
            key={item.titulo}
            className={`flex flex-col gap-1.5 border-border p-4 md:px-6 md:py-5 ${
              i < ITENS.length - 1 ? "border-b md:border-b-0 md:border-r" : ""
            }`}
          >
            <div className="mb-1 text-[22px]">{item.icon}</div>
            <div className="text-sm font-bold">{item.titulo}</div>
            <div className="text-xs leading-[1.5] text-muted">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
