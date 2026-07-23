// Popula o Supabase com marcas, categorias e as 16 motos do protótipo original.
// Uso: node --env-file=.env.local scripts/seed.mjs
// Requer NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (chave service_role, nunca exposta ao browser).

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (em .env.local) antes de rodar o seed."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MARCAS = ["Honda", "Yamaha", "Triumph", "Suzuki"];
const CATEGORIAS = ["Seminova", "Premium"];

const MOTOS = [
  { marca: "Yamaha", modelo: "YBR 125", ano: 2011, km: 65350, preco: 9900, cor: "Roxa", cilindrada: "125cc", categoria: "Seminova", destaque: false, imagem: "img-01.jpeg" },
  { marca: "Yamaha", modelo: "Crypton", ano: 2015, km: 34326, preco: 9900, cor: "Preta", cilindrada: "115cc", categoria: "Seminova", destaque: false, imagem: "img-02.jpeg" },
  { marca: "Yamaha", modelo: "YBR 125", ano: 2007, km: 78225, preco: 10900, cor: "Verde", cilindrada: "125cc", categoria: "Seminova", destaque: false, imagem: "img-03.jpeg" },
  { marca: "Honda", modelo: "POP 110i", ano: 2023, km: 8543, preco: 13900, cor: "Branca/Verm.", cilindrada: "110cc", categoria: "Seminova", destaque: false, imagem: "img-04.jpeg" },
  { marca: "Yamaha", modelo: "Fazer 250", ano: 2011, km: 162178, preco: 13900, cor: "Vermelha", cilindrada: "249cc", categoria: "Seminova", destaque: false, imagem: "img-05.jpeg" },
  { marca: "Honda", modelo: "Biz 110i", ano: 2023, km: 24661, preco: 16900, cor: "Vermelha", cilindrada: "Sem embreagem", categoria: "Seminova", destaque: true, imagem: "img-06.jpeg" },
  { marca: "Yamaha", modelo: "Fazer 250", ano: 2014, km: 75663, preco: 16900, cor: "Azul", cilindrada: "249cc", categoria: "Seminova", destaque: false, imagem: "img-07.jpeg" },
  { marca: "Honda", modelo: "Start 160", ano: 2024, km: 19400, preco: 18900, cor: "Preta", cilindrada: "162cc", categoria: "Seminova", destaque: false, imagem: "img-08.jpeg" },
  { marca: "Yamaha", modelo: "Crosser 150", ano: 2022, km: 89489, preco: 19900, cor: "Branca", cilindrada: "150cc", categoria: "Seminova", destaque: false, imagem: "img-09.jpeg" },
  { marca: "Yamaha", modelo: "Crosser 150", ano: 2018, km: 84488, preco: 17900, cor: "Azul", cilindrada: "150cc", categoria: "Seminova", destaque: false, imagem: "img-10.jpeg" },
  { marca: "Honda", modelo: "PCX 160", ano: 2023, km: 31035, preco: 21900, cor: "Cinza", cilindrada: "CVT Auto", categoria: "Seminova", destaque: true, imagem: "img-11.jpeg" },
  { marca: "Honda", modelo: "PCX 160", ano: 2024, km: 6881, preco: 22900, cor: "Azul", cilindrada: "CVT Auto", categoria: "Seminova", destaque: true, imagem: "img-12.jpeg" },
  { marca: "Yamaha", modelo: "MT-03", ano: 2019, km: 12702, preco: 25900, cor: "Preta", cilindrada: "321cc", categoria: "Premium", destaque: false, imagem: null },
  { marca: "Honda", modelo: "XRE 190", ano: 2024, km: 70813, preco: 25900, cor: "Preta", cilindrada: "190cc", categoria: "Seminova", destaque: false, imagem: "img-13.jpeg" },
  { marca: "Honda", modelo: "CBR 600F", ano: 2013, km: 79000, preco: 42000, cor: "Branca/Verm.", cilindrada: "600cc", categoria: "Premium", destaque: false, imagem: null },
  { marca: "Triumph", modelo: "Bonneville", ano: 2019, km: 38485, preco: 42900, cor: "Preta", cilindrada: "900cc", categoria: "Premium", destaque: false, imagem: null },
];

async function upsertMarcas() {
  const mapa = new Map();
  for (const nome of MARCAS) {
    const slug = slugify(nome);
    const { data, error } = await supabase
      .from("marcas")
      .upsert({ nome, slug }, { onConflict: "slug" })
      .select("id, nome")
      .single();
    if (error) throw error;
    mapa.set(nome, data.id);
  }
  return mapa;
}

async function upsertCategorias() {
  const mapa = new Map();
  for (const nome of CATEGORIAS) {
    const slug = slugify(nome);
    const { data, error } = await supabase
      .from("categorias")
      .upsert({ nome, slug }, { onConflict: "slug" })
      .select("id, nome")
      .single();
    if (error) throw error;
    mapa.set(nome, data.id);
  }
  return mapa;
}

async function gerarSlugUnicoMoto(base) {
  const baseSlug = slugify(base);
  let slug = baseSlug;
  let contador = 1;
  while (true) {
    const { data } = await supabase.from("motos").select("id").eq("slug", slug).limit(1);
    if (!data || data.length === 0) return slug;
    contador += 1;
    slug = `${baseSlug}-${contador}`;
  }
}

async function uploadImagem(motoSlug, arquivo) {
  const caminhoLocal = path.join(__dirname, "..", "public", "seed", "motos", arquivo);
  if (!existsSync(caminhoLocal)) {
    console.warn(`  aviso: arquivo não encontrado: ${caminhoLocal}`);
    return null;
  }
  const buffer = readFileSync(caminhoLocal);
  const destino = `${motoSlug}/${arquivo}`;

  const { error } = await supabase.storage
    .from("motos-fotos")
    .upload(destino, buffer, { contentType: "image/jpeg", upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from("motos-fotos").getPublicUrl(destino);
  return data.publicUrl;
}

async function main() {
  console.log("Criando marcas...");
  const marcas = await upsertMarcas();

  console.log("Criando categorias...");
  const categorias = await upsertCategorias();

  console.log("Inserindo motos...");
  for (const moto of MOTOS) {
    const nomeCompleto = `${moto.marca} ${moto.modelo} ${moto.ano}`;
    const slug = await gerarSlugUnicoMoto(nomeCompleto);

    const { data: motoInserida, error } = await supabase
      .from("motos")
      .insert({
        slug,
        marca_id: marcas.get(moto.marca),
        categoria_id: categorias.get(moto.categoria),
        modelo: moto.modelo,
        ano: moto.ano,
        km: moto.km,
        preco: moto.preco,
        specs: { cor: moto.cor, cilindrada: moto.cilindrada },
        status: "disponivel",
        destaque: moto.destaque,
      })
      .select("id, slug")
      .single();

    if (error) {
      console.error(`  erro ao inserir ${nomeCompleto}:`, error.message);
      continue;
    }

    console.log(`  + ${nomeCompleto} (${motoInserida.slug})`);

    if (moto.imagem) {
      const url = await uploadImagem(motoInserida.slug, moto.imagem);
      if (url) {
        const { error: imgError } = await supabase.from("imagens").insert({
          moto_id: motoInserida.id,
          url,
          ordem: 0,
          alt_text: nomeCompleto,
        });
        if (imgError) console.error(`    erro ao salvar imagem:`, imgError.message);
        else console.log(`    foto enviada`);
      }
    }
  }

  console.log("\nSeed concluído.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
