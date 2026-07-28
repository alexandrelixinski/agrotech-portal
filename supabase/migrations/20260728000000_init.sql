-- AgroTech Portal — schema inicial
-- Como aplicar (sem CLI, enquanto o projeto Supabase é novo):
--   1. Abra o dashboard do projeto no Supabase
--   2. Vá em SQL Editor → New query
--   3. Cole este arquivo inteiro e clique em Run

create extension if not exists pgcrypto;

-- Lotes / safras
create table if not exists lotes (
  id uuid primary key default gen_random_uuid(),
  cultura text not null,
  variedade text,
  area_hectares numeric not null default 0,
  data_plantio date not null,
  custo_total numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Itens do galpão (estoque de insumos)
create table if not exists itens_estoque (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text not null check (categoria in ('Sementes', 'Adubos', 'Diesel', 'Defensivos', 'Outros')),
  quantidade numeric not null default 0,
  unidade text not null default 'un',
  preco_unitario numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Movimentações de um lote (substitui o "diário" em texto livre do protótipo)
create table if not exists movimentacoes (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid not null references lotes(id) on delete cascade,
  item_estoque_id uuid references itens_estoque(id) on delete set null,
  tipo text not null check (tipo in ('insumo', 'mao_de_obra', 'diesel', 'compra_avulsa', 'nota')),
  descricao text,
  quantidade numeric,
  valor numeric not null default 0,
  data date not null,
  agendado boolean not null default false,
  created_at timestamptz not null default now()
);

-- Vendas de safra
create table if not exists vendas (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid references lotes(id) on delete set null,
  quantidade numeric not null,
  valor_total numeric not null,
  data date not null,
  created_at timestamptz not null default now()
);

-- Lançamentos financeiros avulsos (gastos gerais não ligados a uma operação de lote)
create table if not exists lancamentos_financeiros (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  categoria text,
  valor numeric not null,
  lote_id uuid references lotes(id) on delete set null,
  data date not null,
  created_at timestamptz not null default now()
);

-- RLS habilitado com policy permissiva: sem autenticação por enquanto,
-- a chave anon tem acesso total. Quando a autenticação for adicionada,
-- troque `using (true) with check (true)` por regras com auth.uid(),
-- sem precisar alterar o schema.
alter table lotes enable row level security;
alter table itens_estoque enable row level security;
alter table movimentacoes enable row level security;
alter table vendas enable row level security;
alter table lancamentos_financeiros enable row level security;

create policy "Acesso público (sem auth) - lotes" on lotes
  for all using (true) with check (true);

create policy "Acesso público (sem auth) - itens_estoque" on itens_estoque
  for all using (true) with check (true);

create policy "Acesso público (sem auth) - movimentacoes" on movimentacoes
  for all using (true) with check (true);

create policy "Acesso público (sem auth) - vendas" on vendas
  for all using (true) with check (true);

create policy "Acesso público (sem auth) - lancamentos_financeiros" on lancamentos_financeiros
  for all using (true) with check (true);
