-- Weekly operating hours (with optional break) and one-off closed dates.
-- Reservation slots themselves are computed on the fly from these rows plus
-- each menu item's duration_min, so no slot table is needed.

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  is_open boolean not null default true,
  start_time time,
  end_time time,
  break_start_time time,
  break_end_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, day_of_week),
  constraint business_hours_open_requires_times check (
    not is_open or (start_time is not null and end_time is not null and end_time > start_time)
  ),
  constraint business_hours_break_within_hours check (
    (break_start_time is null and break_end_time is null)
    or (
      break_start_time is not null and break_end_time is not null
      and break_end_time > break_start_time
      and break_start_time >= start_time and break_end_time <= end_time
    )
  )
);

create index business_hours_store_id_idx on public.business_hours (store_id);

create trigger set_business_hours_updated_at
  before update on public.business_hours
  for each row
  execute function public.set_updated_at();

alter table public.business_hours enable row level security;

create policy "Owners can manage their business hours"
  on public.business_hours for all
  using (
    exists (
      select 1 from public.stores
      where stores.id = business_hours.store_id
        and stores.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.stores
      where stores.id = business_hours.store_id
        and stores.owner_id = auth.uid()
    )
  );

-- Closed dates -------------------------------------------------------------

create table public.closed_dates (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  closed_date date not null,
  reason text,
  created_at timestamptz not null default now(),
  unique (store_id, closed_date)
);

create index closed_dates_store_id_idx on public.closed_dates (store_id);

alter table public.closed_dates enable row level security;

create policy "Owners can manage their closed dates"
  on public.closed_dates for all
  using (
    exists (
      select 1 from public.stores
      where stores.id = closed_dates.store_id
        and stores.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.stores
      where stores.id = closed_dates.store_id
        and stores.owner_id = auth.uid()
    )
  );
