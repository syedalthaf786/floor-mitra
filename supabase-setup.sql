create table if not exists public.app_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

grant usage on schema public to anon;
grant select, insert, update on public.app_state to anon;

create policy "FloorMitra app state read"
on public.app_state for select to anon using (id = 'floormitra');

create policy "FloorMitra app state insert"
on public.app_state for insert to anon with check (id = 'floormitra');

create policy "FloorMitra app state update"
on public.app_state for update to anon using (id = 'floormitra') with check (id = 'floormitra');
