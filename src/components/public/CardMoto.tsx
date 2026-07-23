"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatKm, formatPreco, buildWhatsappLink, mensagemInteresseMoto } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/public/WhatsAppFloat";
import type { MotoComRelacoes } from "@/types/database";

const SWIPE_THRESHOLD_PX = 40;

function Badge({ moto }: { moto: MotoComRelacoes }) {
  if (moto.status === "vendida") {
    return (
      <div className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#555] px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[1.5px] text-white">
        Vendida
      </div>
    );
  }
  if (moto.status === "reservada") {
    return (
      <div className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#8a5a00] px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[1.5px] text-white">
        Reservada
      </div>
    );
  }
  if (moto.destaque) {
    return (
      <div className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#FFB800] px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[1.5px] text-black">
        Destaque
      </div>
    );
  }
  return (
    <div className="absolute left-2.5 top-2.5 z-10 rounded-full bg-orange px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[1.5px] text-white">
      {moto.categoria?.nome ?? "Seminova"}
    </div>
  );
}

function ArrowButton({
  direcao,
  onClick,
}: {
  direcao: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direcao === "left" ? "Foto anterior" : "Próxima foto"}
      className={`absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-100 backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100 ${
        direcao === "left" ? "left-2" : "right-2"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white" strokeWidth={2.5}>
        {direcao === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

function CardImagem({ moto, nomeCompleto }: { moto: MotoComRelacoes; nomeCompleto: string }) {
  const imagens = moto.imagens;
  const [indice, setIndice] = useState(0);
  const dragInfo = useRef({ startX: 0, dragging: false, swiped: false });

  const total = imagens.length;
  const foto = imagens[indice];

  function irPara(novoIndice: number, e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    setIndice((novoIndice + total) % total);
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (total < 2) return;
    dragInfo.current = { startX: e.clientX, dragging: true, swiped: false };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragInfo.current.dragging) return;
    const delta = e.clientX - dragInfo.current.startX;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX && !dragInfo.current.swiped) {
      dragInfo.current.swiped = true;
      setIndice((prev) => {
        const direcao = delta < 0 ? 1 : -1;
        return (prev + direcao + total) % total;
      });
    }
  }

  function handlePointerUp() {
    dragInfo.current.dragging = false;
  }

  function handleClickCapture(e: React.MouseEvent) {
    if (dragInfo.current.swiped) {
      e.preventDefault();
      e.stopPropagation();
      dragInfo.current.swiped = false;
    }
  }

  if (!foto) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] text-5xl">
        🏍️
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full touch-pan-y select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClickCapture={handleClickCapture}
    >
      <Image
        src={foto.url}
        alt={foto.alt_text ?? nomeCompleto}
        fill
        draggable={false}
        sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 260px"
        className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.04]"
        style={{ objectPosition: "center 20%" }}
      />
      {total > 1 && (
        <>
          <ArrowButton direcao="left" onClick={(e) => irPara(indice - 1, e)} />
          <ArrowButton direcao="right" onClick={(e) => irPara(indice + 1, e)} />
          <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1">
            {imagens.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={(e) => irPara(i, e)}
                aria-label={`Ver foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === indice ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function CardMoto({ moto, whatsapp }: { moto: MotoComRelacoes; whatsapp: string }) {
  const nomeCompleto = `${moto.marca.nome} ${moto.modelo} ${moto.ano}`;
  const linkWpp = buildWhatsappLink(whatsapp, mensagemInteresseMoto(nomeCompleto, moto.preco));

  return (
    <div className="group flex flex-col overflow-hidden rounded-[14px] border border-border bg-card transition-[transform,border-color] hover:-translate-y-1 hover:border-orange/35">
      <Link href={`/motos/${moto.slug}`} className="relative block aspect-[3/4] w-full shrink-0 overflow-hidden bg-[#111]">
        <CardImagem moto={moto} nomeCompleto={nomeCompleto} />
        <Badge moto={moto} />
      </Link>
      <div className="flex flex-1 flex-col p-[18px] pt-4">
        <div className="mb-[3px] text-[10px] font-bold uppercase tracking-[2.5px] text-orange">
          {moto.marca.nome}
        </div>
        <Link href={`/motos/${moto.slug}`}>
          <div className="mb-2.5 font-display text-[22px] font-black uppercase leading-none text-white">
            {moto.modelo} {moto.ano}
          </div>
        </Link>
        <div className="mb-3 flex flex-col gap-[5px]">
          <div className="flex items-center gap-1.5 text-xs text-muted">🕐 {formatKm(moto.km)}</div>
          {moto.specs.cor && (
            <div className="flex items-center gap-1.5 text-xs text-muted">🎨 {moto.specs.cor}</div>
          )}
          {moto.specs.cilindrada && (
            <div className="flex items-center gap-1.5 text-xs text-muted">⚙️ {moto.specs.cilindrada}</div>
          )}
        </div>
        <div className="my-2.5 h-px bg-border" />
        <div className="mt-auto flex items-center justify-between gap-2.5">
          <div>
            <div className="mb-0.5 text-[10px] text-muted">por apenas</div>
            <div className="font-display text-[26px] font-black leading-none text-white">
              {formatPreco(moto.preco)}
            </div>
          </div>
          <a
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-green px-3 py-[9px] text-xs font-bold text-white transition-opacity hover:opacity-[0.88]"
            href={linkWpp}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon className="h-[15px] w-[15px] shrink-0 fill-white" />
            Tenho interesse
          </a>
        </div>
      </div>
    </div>
  );
}
