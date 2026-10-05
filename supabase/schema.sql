-- Jalankan di Supabase: SQL Editor. Ganti UUID di bawah dengan UUID akun lu
-- (Authentication > Users > klik akun lu > copy User UID).
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text default '',
  content text default '',
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on public.posts (status, published_at desc);
alter table public.posts enable row level security;

-- Publik: hanya post terbit yang waktunya sudah lewat (ini yang bikin jadwal otomatis)
create policy "public read published" on public.posts for select
  using (status = 'published' and published_at <= now());

-- Pemilik: baca (termasuk draft), tulis, ubah, hapus
create policy "owner all" on public.posts for all
  using (auth.uid() = 'ab7bd03e-8824-4198-81b8-e221ab7aa833')
  with check (auth.uid() = 'ab7bd03e-8824-4198-81b8-e221ab7aa833');

create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();
