-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'video',
  year text,
  description text default '',
  image text default '',
  image_path text default '',
  embed text default '',
  created_at timestamptz not null default now()
);
-- Only your server (service key) can touch this table; the public cannot.
alter table public.projects enable row level security;

-- Public bucket for cover images (anyone can view images, only your server can upload)
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;
