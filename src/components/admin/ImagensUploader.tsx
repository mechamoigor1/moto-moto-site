"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { adicionarImagem, removerImagem, moverImagem } from "@/lib/actions/imagens";
import type { Imagem } from "@/types/database";

export function ImagensUploader({
  motoId,
  imagens,
  altBase,
}: {
  motoId: string;
  imagens: Imagem[];
  altBase: string;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setEnviando(true);
    setErro(null);
    try {
      const supabase = createClient();
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${motoId}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from("motos-fotos")
          .upload(path, file, { cacheControl: "3600" });
        if (error) throw error;

        const { data } = supabase.storage.from("motos-fotos").getPublicUrl(path);
        await adicionarImagem(motoId, data.publicUrl, altBase);
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha no upload.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      {imagens.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {imagens.map((img, i) => (
            <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg border border-border">
              <Image src={img.url} alt={img.alt_text ?? ""} fill sizes="150px" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/70 px-1 py-0.5">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => startTransition(() => moverImagem(motoId, img.id, "up"))}
                  className="px-1 text-xs text-white disabled:opacity-30"
                  title="Mover para trás"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => startTransition(() => removerImagem(img.id, motoId))}
                  className="px-1 text-xs text-orange"
                  title="Remover"
                >
                  ✕
                </button>
                <button
                  type="button"
                  disabled={i === imagens.length - 1}
                  onClick={() => startTransition(() => moverImagem(motoId, img.id, "down"))}
                  className="px-1 text-xs text-white disabled:opacity-30"
                  title="Mover para frente"
                >
                  ▶
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted hover:border-orange/50 hover:text-white">
        {enviando ? "Enviando..." : "+ Adicionar fotos"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={enviando}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {erro && <p className="mt-2 text-sm text-orange">{erro}</p>}
    </div>
  );
}
