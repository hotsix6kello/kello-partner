-- One store per partner account. business_types is an array so a store can
-- run multiple presets (e.g. hair + makeup) at once.

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null default '',
  business_types public.business_type[] not null default '{}',
  capacity integer not null default 1 check (capacity >= 1),
  lead_time_hours integer not null default 2 check (lead_time_hours >= 0),
  slot_interval_minutes integer not null default 30 check (slot_interval_minutes > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_stores_updated_at
  before update on public.stores
  for each row
  execute function public.set_updated_at();

alter table public.stores enable row level security;

create policy "Owners can view their store"
  on public.stores for select
  using (auth.uid() = owner_id);

create policy "Owners can insert their store"
  on public.stores for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their store"
  on public.stores for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their store"
  on public.stores for delete
  using (auth.uid() = owner_id);
