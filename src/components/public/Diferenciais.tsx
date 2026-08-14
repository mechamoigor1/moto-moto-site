import { Icon, type IconName } from "@/components/ui/Icon";

const ITENS: { icon: IconName; titulo: string; desc: string }[] = [
  {
    icon: "shield-check",
    titulo: "Procedência de verdade",
    desc: "Motos com laudo cautelar aprovado antes de entrar no estoque.",
  },
  {
    icon: "wrench",
    titulo: "Revisadas em oficina própria",
    desc: "Cada moto passa por revisão antes de chegar até você.",
  },
  {
    icon: "clock",
    titulo: "90 dias de garantia",
    desc: "Mais tranquilidade para sair da loja e aproveitar sua moto.",
  },
  {
    icon: "repeat",
    titulo: "Sua moto entra no negócio",
    desc: "Avaliamos sua usada e descontamos o valor na negociação.",
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
            <Icon name={item.icon} className="mb-1 h-[22px] w-[22px] text-orange" />
            <div className="text-sm font-bold">{item.titulo}</div>
            <div className="text-xs leading-[1.5] text-muted">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
