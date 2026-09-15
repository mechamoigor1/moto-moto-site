"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";
import { adicionarImagem, removerImagem, moverImagem } from "@/lib/actions/imagens";
import { convertImageToWebp } from "@/lib/image-webp";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import type { Imagem } from "@/types/database";

const BUCKET = "motos-fotos-webp";

type Etapa = "convertendo" | "enviando";

type Progresso = {
  arquivoAtual: number;
  totalArquivos: number;
  etapa: Etapa;
  fracaoArquivo: number;
};

const PROGRESSO_INICIAL: Progresso = {
  arquivoAtual: 0,
  totalArquivos: 0,
  etapa: "convertendo",
  fracaoArquivo: 0,
};

function uploadComProgresso(
  path: string,
  arquivo: Blob,
  accessToken: string,
  onProgresso: (fracao: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${supabaseUrl}/storage/v1/object/${BUCKET}/${path}`);
    xhr.setRequestHeader("authorization", `Bearer ${accessToken}`);
    xhr.setRequestHeader("apikey", supabaseAnonKey ?? "");
    xhr.setRequestHeader("content-type", "image/webp");
    xhr.setRequestHeader("cache-control", "31536000");
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (evento) => {
      if (evento.lengthComputable) onProgresso(evento.loaded / evento.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgresso(1);
        resolve();
      } else {
        let motivo = xhr.responseText;
        try {
          const corpo = JSON.parse(xhr.responseText);
          motivo = corpo.message ?? corpo.error ?? xhr.responseText;
        } catch {
          // resposta não era JSON, usa o texto bruto mesmo
        }
        reject(new Error(`Falha ao enviar a imagem (${xhr.status}): ${motivo || "erro desconhecido"}`));
      }
    };
    xhr.onerror = () => reject(new Error("Falha ao enviar a imagem: erro de rede/CORS."));
    xhr.send(arquivo);
  });
}

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
  const [movendo, startTransition] = useTransition();
  const [progresso, setProgresso] = useState<Progresso>(PROGRESSO_INICIAL);
  const [ocultas, setOcultas] = useState<Set<string>>(new Set());
  const [ordemLocal, setOrdemLocal] = useState(imagens);

  useEffect(() => {
    setOrdemLocal(imagens);
  }, [imagens]);

  const percentual = progresso.totalArquivos
    ? Math.round(
        ((progresso.arquivoAtual - 1 + progresso.fracaoArquivo) / progresso.totalArquivos) * 100
      )
    : 0;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const lista = Array.from(files);
    setEnviando(true);
    setErro(null);
    setProgresso({ ...PROGRESSO_INICIAL, totalArquivos: lista.length });

    try {
      const supabase = createClient();
      // Força a renovação do token antes de enviar: uma sessão perto de
      // expirar (getSession() pode devolver o token antigo do cache) faz o
      // Storage tratar a chamada como anônima e barrar pela RLS.
      const { data: sessaoRenovada } = await supabase.auth.refreshSession();
      const accessToken = sessaoRenovada.session?.access_token;
      if (!accessToken) throw new Error("Sessão expirada. Faça login novamente.");

      for (let i = 0; i < lista.length; i++) {
        const file = lista[i];

        setProgresso({
          arquivoAtual: i + 1,
          totalArquivos: lista.length,
          etapa: "convertendo",
          fracaoArquivo: 0,
        });
        const webp = await convertImageToWebp(file);
        const path = `${motoId}/${crypto.randomUUID()}.webp`;

        setProgresso({
          arquivoAtual: i + 1,
          totalArquivos: lista.length,
          etapa: "enviando",
          fracaoArquivo: 0,
        });
        await uploadComProgresso(path, webp, accessToken, (fracao) =>
          setProgresso((atual) => ({ ...atual, fracaoArquivo: fracao }))
        );

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        try {
          await adicionarImagem(motoId, data.publicUrl, altBase);
        } catch (databaseError) {
          await supabase.storage.from(BUCKET).remove([path]);
          throw databaseError;
        }
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha no upload.");
    } finally {
      setEnviando(false);
      setProgresso(PROGRESSO_INICIAL);
    }
  }

  function handleRemover(imagemId: string) {
    setOcultas((atual) => new Set(atual).add(imagemId));
    startTransition(async () => {
      try {
        await removerImagem(imagemId, motoId);
      } catch (e) {
        setOcultas((atual) => {
          const proxima = new Set(atual);
          proxima.delete(imagemId);
          return proxima;
        });
        setErro(e instanceof Error ? e.message : "Não foi possível remover a imagem.");
      }
    });
  }

  function handleMover(imagemId: string, direcao: "up" | "down") {
    let anterior = ordemLocal;
    setOrdemLocal((atual) => {
      anterior = atual;
      const index = atual.findIndex((img) => img.id === imagemId);
      const alvo = direcao === "up" ? index - 1 : index + 1;
      if (index === -1 || alvo < 0 || alvo >= atual.length) return atual;
      const proxima = [...atual];
      [proxima[index], proxima[alvo]] = [proxima[alvo], proxima[index]];
      return proxima;
    });
    startTransition(async () => {
      try {
        await moverImagem(motoId, imagemId, direcao);
      } catch (e) {
        setOrdemLocal(anterior);
        setErro(e instanceof Error ? e.message : "Não foi possível mover a imagem.");
      }
    });
  }

  const imagensVisiveis = ordemLocal.filter((img) => !ocultas.has(img.id));

  return (
    <div className="relative">
      {enviando && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/80 backdrop-blur-sm">
          <div className="h-2 w-48 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-orange transition-all"
              style={{ width: `${percentual}%` }}
            />
          </div>
          <p className="text-sm font-semibold text-white">
            {progresso.etapa === "convertendo" ? "Convertendo" : "Enviando"} foto{" "}
            {progresso.arquivoAtual} de {progresso.totalArquivos} — {percentual}%
          </p>
        </div>
      )}

      {imagensVisiveis.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {imagensVisiveis.map((img, i) => (
            <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg border border-border">
              <Image src={img.url} alt={img.alt_text ?? ""} fill sizes="150px" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/70 px-1 py-0.5">
                <button
                  type="button"
                  disabled={i === 0 || movendo}
                  onClick={() => handleMover(img.id, "up")}
                  className="px-1 text-xs text-white disabled:opacity-30"
                  title="Mover para trás"
                >
                  <Icon name="chevron-left" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemover(img.id)}
                  className="px-1 text-xs text-orange"
                  aria-label="Remover imagem"
                  title="Remover imagem"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={i === imagensVisiveis.length - 1 || movendo}
                  onClick={() => handleMover(img.id, "down")}
                  className="px-1 text-xs text-white disabled:opacity-30"
                  title="Mover para frente"
                >
                  <Icon name="chevron-right" className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted hover:border-orange/50 hover:text-white">
        {enviando ? `Enviando... ${percentual}%` : "Adicionar fotos"}
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
