import { MotoForm } from "@/components/admin/MotoForm";
import { criarMoto } from "@/lib/actions/motos";
import { getMarcas } from "@/lib/data/marcas";
import { getCategorias } from "@/lib/data/categorias";

export default async function NovaMotoPage() {
  const [marcas, categorias] = await Promise.all([getMarcas(), getCategorias()]);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-3xl font-black uppercase">Cadastrar moto</h1>
      <MotoForm action={criarMoto} marcas={marcas} categorias={categorias} textoBotao="Cadastrar moto" />
      <p className="mt-4 text-xs text-muted">
        Depois de cadastrar você poderá adicionar as fotos na tela de edição.
      </p>
    </div>
  );
}
