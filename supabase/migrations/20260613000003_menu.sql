-- Menu categories, items and per-item price options.
-- Categories are plain store-owned records: business-type presets only seed
-- their initial rows and are not referenced afterwards.

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  name text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_store_id_idx on public.categories (store_id);

create trigger set_categories_updated_at
  before update on public.categories
  for each row
  execute function public.set_updated_at();

alter table public.categories enable row level security;

create policy "Owners can manage their categories"
  on public.categories for all
  using (
    exists (
      select 1 from public.stores
      where stores.id = categories.store_id
        and stores.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.stores
      where stores.id = categories.store_id
        and stores.owner_id = auth.uid()
    )
  );

-- Menu items -----------------------------------------------------------

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  store_id uuid not null references public.stores (id) on delete cascade,
  name text not null,
  price_type public.price_type not null default 'fixed',
  price integer,
  price_min integer,
  price_max integer,
  duration_min integer not null check (duration_min > 0 and duration_min % 30 = 0),
  description text,
  visible boolean not null default true,
  review_status public.review_status not null default 'pending',
  review_reason text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint menu_items_price_matches_type check (
    case price_type
      when 'range' then price is null and price_min is not null and price_max is not null and price_min <= price_max
      else price is not null and price_min is null and price_max is null
    end
  ),
  constraint menu_items_prices_non_negative check (
    (price is null or price >= 0)
    and (price_min is null or price_min >= 0)
    and (price_max is null or price_max >= 0)
  )
);

create index menu_items_category_id_idx on public.menu_items (category_id);
create index menu_items_store_id_idx on public.menu_items (store_id);

create trigger set_menu_items_updated_at
  before update on public.menu_items
  for each row
  execute function public.set_updated_at();

-- An approved item that gets edited goes back to "pending" review.
create or replace function public.reset_menu_item_review_status()
returns trigger
language plpgsql
as $$
begin
  if old.review_status = 'approved'
     and new.review_status = old.review_status
     and (
       new.name is distinct from old.name
       or new.price_type is distinct from old.price_type
       or new.price is distinct from old.price
       or new.price_min is distinct from old.price_min
       or new.price_max is distinct from old.price_max
       or new.duration_min is distinct from old.duration_min
       or new.description is distinct from old.description
     )
  then
    new.review_status = 'pending';
    new.review_reason = null;
  end if;

  return new;
end;
$$;

create trigger menu_items_reset_review_status
  before update on public.menu_items
  for each row
  execute function public.reset_menu_item_review_status();

alter table public.menu_items enable row level security;

create policy "Owners can manage their menu items"
  on public.menu_items for all
  using (
    exists (
      select 1 from public.stores
      where stores.id = menu_items.store_id
        and stores.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.stores
      where stores.id = menu_items.store_id
        and stores.owner_id = auth.uid()
    )
  );

-- Menu item options (length/design add-ons) ----------------------------

create table public.menu_item_options (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references public.menu_items (id) on delete cascade,
  name text not null,
  price integer not null check (price >= 0),
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index menu_item_options_menu_item_id_idx on public.menu_item_options (menu_item_id);

alter table public.menu_item_options enable row level security;

create policy "Owners can manage their menu item options"
  on public.menu_item_options for all
  using (
    exists (
      select 1 from public.menu_items
      join public.stores on stores.id = menu_items.store_id
      where menu_items.id = menu_item_options.menu_item_id
        and stores.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.menu_items
      join public.stores on stores.id = menu_items.store_id
      where menu_items.id = menu_item_options.menu_item_id
        and stores.owner_id = auth.uid()
    )
  );
