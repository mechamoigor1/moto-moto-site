"use client";

import { useState } from "react";
import Image from "next/image";
import type { Imagem } from "@/types/database";

export function GaleriaFotos({ imagens, nome }: { imagens: Imagem[]; nome: string }) {
  const [ativa, setAtiva] = useState(0);

  if (imagens.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] text-8xl">
        🏍️
      </div>
    );
  }

  const foto = imagens[ativa];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-[#111]">
        <Image
          src={foto.url}
          alt={foto.alt_text ?? nome}
          fill
          sizes="(max-width: 768px) 100vw, 520px"
          className="object-cover"
          priority
        />
      </div>
      {imagens.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {imagens.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setAtiva(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border transition-colors ${
                i === ativa ? "border-orange" : "border-border hover:border-white/30"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt_text ?? nome}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
