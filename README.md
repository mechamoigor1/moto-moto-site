# Moto Moto Paulínia — Site + Painel Administrativo

Site de vendas de motos seminovas com catálogo público (Next.js + ISR) e painel
administrativo (`/admin`) para o dono da loja gerenciar o estoque, sem depender
de programador. Stack: **Next.js (App Router) + Supabase (Postgres, Auth,
Storage) + Tailwind CSS**, seguindo o SDD do projeto.

O visual foi migrado 1:1 do protótipo HTML original (`Moto Moto Paulínia`),
com os dados reais das 16 motos do protótipo prontos para popular o banco.

## 1. Pré-requisitos

- Node.js 20+
- Uma conta gratuita em [supabase.com](https://supabase.com)

## 2. Criar o projeto Supabase

1. Crie um projeto em [supabase.com/dashboard](https://supabase.com/dashboard).
2. Vá em **SQL Editor** e rode o conteúdo de `database/schema.sql`
   (cria tabelas, RLS e o bucket de fotos).
3. Vá em **Settings > API** e copie:
   - `Project URL`
   - `anon public key`
   - `service_role key` (fica em "Project API keys", **nunca** exponha no
     front-end — só é usada pelo script de seed)

## 3. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e
`SUPABASE_SERVICE_ROLE_KEY` com os valores copiados no passo anterior.

## 4. Instalar dependências e popular o banco

```bash
npm install
npm run seed
```

O `npm run seed` cria as marcas (Honda, Yamaha, Triumph, Suzuki), categorias
(Seminova, Premium) e as 16 motos do protótipo original, enviando as fotos
reais (em `public/seed/motos/`) para o Supabase Storage.

## 5. Criar seu usuário admin

1. No dashboard do Supabase, vá em **Authentication > Users > Add user** e
   crie seu usuário (e-mail + senha).
2. No **SQL Editor**, edite `database/create-admin.sql` trocando o e-mail
   pelo que você acabou de criar, e rode o script — isso dá a esse usuário
   acesso de admin ao painel `/admin`.

## 6. Rodar o projeto

```bash
npm run dev
```

- Site público: [http://localhost:3000](http://localhost:3000)
- Painel administrativo: [http://localhost:3000/admin](http://localhost:3000/admin)

Sem o Supabase configurado, o site ainda sobe e mostra um aviso no topo das
páginas públicas explicando o que falta — assim dá pra ver o layout antes de
configurar o banco.

## Estrutura do projeto

```
database/           schema.sql (tabelas + RLS + storage) e create-admin.sql
scripts/seed.mjs     popula o banco com as 16 motos do protótipo
src/app/(public)/    site público: home, /motos, /motos/[slug], /marcas/[slug], /contato
src/app/admin/       painel administrativo (login + área protegida)
src/components/      componentes React (public/ e admin/)
src/lib/data/        leituras do Supabase (Server Components)
src/lib/actions/     Server Actions (mutações + revalidação + log de auditoria)
src/lib/supabase/    clients Supabase (browser, server, middleware)
```

## Decisões e próximos passos (ver seção 14 do SDD)

Ficaram como pontos em aberto, para decidir com o cliente:

- **WhatsApp:** hoje usa link `wa.me` simples (igual ao protótipo). Migrar
  para WhatsApp Business API é possível depois, sem mudar a UI.
- **Imagens:** usa Supabase Storage nativo. Cloudinary pode ser adicionado
  depois se precisar de otimização adicional.
- **E-mail de notificação de contato:** o formulário grava em `contatos`, mas
  o envio de e-mail (SMTP/Resend) ainda não está integrado — é só plugar em
  `src/lib/actions/contatos.ts`.
- **Reordenar fotos:** implementado com botões (◀ ▶) em vez de
  drag-and-drop, para manter o escopo simples nesta primeira versão.
