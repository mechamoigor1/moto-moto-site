import { notFound } from "next/navigation";
import { MotoForm } from "@/components/admin/MotoForm";
import { ImagensUploader } from "@/components/admin/ImagensUploader";
import { atualizarMoto } from "@/lib/actions/motos";
import { getMotoParaEdicao } from "@/lib/data/admin";
import { getMarcas } from "@/lib/data/marcas";
import { getCategorias } from "@/lib/data/categorias";

export default async function EditarMotoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ criada?: string }>;
}) {
  const { id } = await params;
  const { criada } = await searchParams;
  const [moto, marcas, categorias] = await Promise.all([
    getMotoParaEdicao(id),
    getMarcas(),
    getCategorias(),
  ]);

  if (!moto) notFound();

  const acaoAtualizar = atualizarMoto.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-display text-3xl font-black uppercase">
        {moto.marca.nome} {moto.modelo} {moto.ano}
      </h1>
      {criada === "1" && (
        <p className="mb-4 text-sm text-green">
          Moto cadastrada! Agora adicione as fotos abaixo.
        </p>
      )}

      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Fotos</h2>
        <ImagensUploader
          motoId={moto.id}
          imagens={moto.imagens}
          altBase={`${moto.marca.nome} ${moto.modelo} ${moto.ano}`}
        />
      </div>

      <MotoForm action={acaoAtualizar} marcas={marcas} categorias={categorias} moto={moto} textoBotao="Salvar alterações" />
    </div>
  );
}
