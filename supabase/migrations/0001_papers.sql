-- ResearchCanvas — papers table + row-level security.
-- Run this in the Supabase SQL editor (or via the CLI).

create table if not exists public.papers (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null,
  insights      jsonb not null,          -- validated PaperInsights JSON
  source_path   text,                    -- path in the 'papers' storage bucket
  created_at    timestamptz not null default now()
);

create index if not exists papers_user_id_created_at_idx
  on public.papers (user_id, created_at desc);

-- Row-level security: each user sees and writes only their own rows.
alter table public.papers enable row level security;

create policy "papers_select_own"
  on public.papers for select
  using (auth.uid() = user_id);

create policy "papers_insert_own"
  on public.papers for insert
  with check (auth.uid() = user_id);

create policy "papers_delete_own"
  on public.papers for delete
  using (auth.uid() = user_id);
