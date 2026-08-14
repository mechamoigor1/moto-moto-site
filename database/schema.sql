-- Moto Moto Paulínia — schema Supabase (Postgres)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase (supabase.com/dashboard > SQL Editor).

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- TABELAS
-- ─────────────────────────────────────────────────────────────

create table if not exists marcas (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  slug text not null unique,
  logo_url text,
  created_at timestamptz not null default now()
);

create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists motos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  marca_id uuid not null references marcas(id) on delete restrict,
  categoria_id uuid references categorias(id) on delete set null,
  modelo text not null,
  ano int not null,
  km int not null default 0,
  preco numeric(12, 2) not null default 0,
  descricao text,
  specs jsonb not null default '{}'::jsonb,
  status text not null default 'disponivel' check (status in ('disponivel', 'reservada', 'vendida', 'oculta')),
  destaque boolean not null default false,
  visualizacoes int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists motos_status_idx on motos(status);
create index if not exists motos_marca_id_idx on motos(marca_id);
create index if not exists motos_categoria_id_idx on motos(categoria_id);

create table if not exists imagens (
  id uuid primary key default gen_random_uuid(),
  moto_id uuid not null references motos(id) on delete cascade,
  url text not null,
  ordem int not null default 0,
  alt_text text,
  created_at timestamptz not null default now()
);

create index if not exists imagens_moto_id_idx on imagens(moto_id);

create table if not exists contatos (
  id uuid primary key default gen_random_uuid(),
  moto_id uuid references motos(id) on delete set null,
  nome text not null,
  telefone text not null,
  mensagem text,
  origem text not null default 'formulario' check (origem in ('whatsapp', 'formulario')),
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  nome text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists configuracoes (
  id int primary key default 1 check (id = 1),
  nome_loja text not null default 'Moto Moto Paulínia',
  whatsapp text not null default '5519994451982',
  telefone_display text not null default '(19) 99445-1982',
  endereco text not null default 'Av. José Paulino, 701',
  cidade_estado text not null default 'Centro, Paulínia/SP',
  instagram text not null default 'motomotopaulinia',
  horario_semana text not null default 'Seg–Sex 08h–18h',
  horario_sabado text not null default 'Sáb 08h–14h',
  maps_url text not null default 'https://maps.google.com/?q=Av.+José+Paulino,+701,+Centro,+Paulínia,+SP',
  updated_at timestamptz not null default now()
);

create table if not exists logs_auditoria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  acao text not null,
  entidade text not null,
  entidade_id text,
  detalhes jsonb,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- TRIGGER: updated_at automático em motos
-- ─────────────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists motos_set_updated_at on motos;
create trigger motos_set_updated_at
  before update on motos
  for each row
  execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────

alter table marcas enable row level security;
alter table categorias enable row level security;
alter table motos enable row level security;
alter table imagens enable row level security;
alter table contatos enable row level security;
alter table profiles enable row level security;
alter table configuracoes enable row level security;
alter table logs_auditoria enable row level security;

-- Helper: usuário autenticado tem um profile (admin ou editor)?
create or replace function is_admin_ou_editor()
returns boolean as $$
  select exists (
    select 1 from profiles
    where user_id = auth.uid() and role in ('admin', 'editor')
  );
$$ language sql stable security definer set search_path = public;

-- marcas: leitura pública, escrita só admin/editor
create policy "marcas_select_publica" on marcas for select using (true);
create policy "marcas_write_admin" on marcas for all
  using (is_admin_ou_editor()) with check (is_admin_ou_editor());

-- categorias: leitura pública, escrita só admin/editor
create policy "categorias_select_publica" on categorias for select using (true);
create policy "categorias_write_admin" on categorias for all
  using (is_admin_ou_editor()) with check (is_admin_ou_editor());

-- motos: leitura pública apenas se status != 'oculta'; admin/editor vê e edita tudo
create policy "motos_select_publica" on motos for select
  using (status <> 'oculta' or is_admin_ou_editor());
create policy "motos_write_admin" on motos for all
  using (is_admin_ou_editor()) with check (is_admin_ou_editor());

-- imagens: leitura pública, escrita só admin/editor
create policy "imagens_select_publica" on imagens for select using (true);
create policy "imagens_write_admin" on imagens for all
  using (is_admin_ou_editor()) with check (is_admin_ou_editor());

-- contatos: inserção pública liberada, leitura só admin/editor
create policy "contatos_insert_publico" on contatos for insert with check (true);
create policy "contatos_select_admin" on contatos for select using (is_admin_ou_editor());
create policy "contatos_write_admin" on contatos for update using (is_admin_ou_editor());
create policy "contatos_delete_admin" on contatos for delete using (is_admin_ou_editor());

-- profiles: cada usuário vê o próprio, admin vê todos
create policy "profiles_select_proprio" on profiles for select
  using (user_id = auth.uid() or is_admin_ou_editor());
create policy "profiles_write_admin" on profiles for all
  using (is_admin_ou_editor()) with check (is_admin_ou_editor());

-- configuracoes: leitura pública, escrita só admin/editor
create policy "configuracoes_select_publica" on configuracoes for select using (true);
create policy "configuracoes_write_admin" on configuracoes for all
  using (is_admin_ou_editor()) with check (is_admin_ou_editor());

-- logs_auditoria: só admin/editor lê e escreve (nunca client-side sem sessão)
create policy "logs_select_admin" on logs_auditoria for select using (is_admin_ou_editor());
create policy "logs_insert_admin" on logs_auditoria for insert with check (is_admin_ou_editor());

-- ─────────────────────────────────────────────────────────────
-- STORAGE: bucket de fotos das motos
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('motos-fotos', 'motos-fotos', true)
on conflict (id) do nothing;

create policy "motos_fotos_select_publica" on storage.objects for select
  using (bucket_id = 'motos-fotos');

create policy "motos_fotos_insert_admin" on storage.objects for insert
  with check (bucket_id = 'motos-fotos' and is_admin_ou_editor());

create policy "motos_fotos_update_admin" on storage.objects for update
  using (bucket_id = 'motos-fotos' and is_admin_ou_editor());

create policy "motos_fotos_delete_admin" on storage.objects for delete
  using (bucket_id = 'motos-fotos' and is_admin_ou_editor());

-- Bucket WebP para todas as novas fotos do painel administrativo.
insert into storage.buckets (id, name, public)
values ('motos-fotos-webp', 'motos-fotos-webp', true)
on conflict (id) do update set public = excluded.public;

create policy "motos_fotos_webp_select_publica" on storage.objects for select
  using (bucket_id = 'motos-fotos-webp');

create policy "motos_fotos_webp_insert_admin" on storage.objects for insert
  with check (bucket_id = 'motos-fotos-webp' and is_admin_ou_editor());

create policy "motos_fotos_webp_update_admin" on storage.objects for update
  using (bucket_id = 'motos-fotos-webp' and is_admin_ou_editor());

create policy "motos_fotos_webp_delete_admin" on storage.objects for delete
  using (bucket_id = 'motos-fotos-webp' and is_admin_ou_editor());

-- ─────────────────────────────────────────────────────────────
-- Linha inicial de configurações (usa os valores padrão da tabela)
-- ─────────────────────────────────────────────────────────────

insert into configuracoes (id) values (1) on conflict (id) do nothing;
