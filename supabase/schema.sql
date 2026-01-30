create extension if not exists "pgcrypto";

create table if not exists public.admin_sessions (
  token uuid primary key default gen_random_uuid(),
  username text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists admin_sessions_expires_idx on public.admin_sessions(expires_at);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  type text not null,
  status text not null,
  price integer not null,
  currency text not null default 'RUB',
  description text not null,
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_type_check check (type in ('personal', 'china')),
  constraint products_status_check check (status in ('available', 'sold', 'preorder'))
);

create index if not exists products_type_idx on public.products(type);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_price_idx on public.products(price);
