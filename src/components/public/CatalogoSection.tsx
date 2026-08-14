"use client";

import { useMemo, useState } from "react";
import { CardMoto } from "@/components/public/CardMoto";
import { Icon } from "@/components/ui/Icon";
import { buildWhatsappLink } from "@/lib/utils";
import type { Marca, MotoComRelacoes } from "@/types/database";

const FAIXAS_PRECO = [
  { label: "Qualquer preço", value: "" },
  { label: "Até R$ 15.000", value: "0-15000" },
  { label: "R$ 15.000 – R$ 25.000", value: "15000-25000" },
  { label: "Acima de R$ 25.000", value: "25000-999999999" },
];

export function CatalogoSection({
  motos,
  marcas,
  whatsapp,
  marcaFixa,
}: {
  motos: MotoComRelacoes[];
  marcas: Marca[];
  whatsapp: string;
  marcaFixa?: string;
}) {
  const [busca, setBusca] = useState("");
  const [marca, setMarca] = useState("");
  const [faixaPreco, setFaixaPreco] = useState("");

  const filtradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    const [min, max] = faixaPreco ? faixaPreco.split("-").map(Number) : [0, Infinity];

    return motos.filter((moto) => {
      const nomeCompleto = `${moto.marca.nome} ${moto.modelo} ${moto.ano} ${moto.specs.cor ?? ""}`.toLowerCase();
      const matchBusca = !termo || nomeCompleto.includes(termo);
      const matchMarca = marcaFixa
        ? moto.marca.slug === marcaFixa
        : !marca || moto.marca.slug === marca;
      const matchPreco = moto.preco >= min && moto.preco <= max;
      return matchBusca && matchMarca && matchPreco;
    });
  }, [motos, busca, marca, faixaPreco, marcaFixa]);

  return (
    <section className="mx-auto max-w-[1100px] px-6 py-14" id="catalogo">
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex min-w-[220px] flex-1 items-center">
          <Icon name="search" className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por modelo, marca ou ano..."
            className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-4 text-sm text-white placeholder:text-muted focus:border-orange/50 focus:outline-none"
          />
        </div>
        {!marcaFixa && (
          <select
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-white focus:border-orange/50 focus:outline-none"
          >
            <option value="">Todas as marcas</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.slug}>
                {m.nome}
              </option>
            ))}
          </select>
        )}
        <select
          value={faixaPreco}
          onChange={(e) => setFaixaPreco(e.target.value)}
          className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-white focus:border-orange/50 focus:outline-none"
        >
          {FAIXAS_PRECO.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5 text-sm text-muted">
        Mostrando <strong className="text-white">{filtradas.length}</strong> moto
        {filtradas.length === 1 ? "" : "s"}
      </div>

      {filtradas.length === 0 ? (
        <div className="py-16 text-center text-muted">
          <Icon name="search" className="mx-auto h-12 w-12 text-muted" />
          <p className="mt-3">
            Nenhuma moto encontrada.{" "}
            <a
              href={buildWhatsappLink(whatsapp, "Olá! Vim pelo site e não achei a moto que procurava.")}
              className="text-orange"
              target="_blank"
              rel="noreferrer"
            >
              Chama no WhatsApp!
            </a>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] sm:gap-5">
          {filtradas.map((moto) => (
            <CardMoto key={moto.id} moto={moto} whatsapp={whatsapp} />
          ))}
        </div>
      )}
    </section>
  );
}
