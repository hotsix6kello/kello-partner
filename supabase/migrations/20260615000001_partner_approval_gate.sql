-- Gate partner portal data behind approved partner applications.
-- The existing public.partners table is the approval source.

do $$
declare
  partner_id_type text;
begin
  if to_regclass('public.partners') is null then
    raise exception 'public.partners table is required before applying partner approval gate policies';
  end if;

  select format_type(attribute.atttypid, attribute.atttypmod)
  into partner_id_type
  from pg_attribute as attribute
  where attribute.attrelid = 'public.partners'::regclass
    and attribute.attname = 'id'
    and not attribute.attisdropped;

  if partner_id_type is null then
    raise exception 'public.partners.id column is required before applying partner approval gate policies';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'stores'
      and column_name = 'partner_id'
  ) then
    execute format('alter table public.stores add column partner_id %s', partner_id_type);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'stores_partner_id_fkey'
      and conrelid = 'public.stores'::regclass
  ) then
    alter table public.stores
      add constraint stores_partner_id_fkey
      foreign key (partner_id)
      references public.partners (id)
      on delete set null;
  end if;
end $$;

create unique index if not exists stores_partner_id_unique_idx
  on public.stores (partner_id)
  where partner_id is not null;

create index if not exists partners_email_status_idx
  on public.partners (lower(email), status);

grant select on public.partners to authenticated;

create or replace function public.current_approved_partner_id()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select partners.id::bigint
  from public.partners
  where lower(partners.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and lower(partners.status) = 'approved'
  order by partners.id
  limit 1;
$$;

create or replace function public.is_store_managed_by_approved_partner(target_store_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.stores
    where stores.id = target_store_id
      and stores.owner_id = auth.uid()
      and (
        stores.partner_id = public.current_approved_partner_id()
        or (
          stores.partner_id is null
          and public.current_approved_partner_id() is not null
        )
      )
  );
$$;

create or replace function public.is_store_managed_by_approved_partner(target_store_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.stores
    where stores.id::text = target_store_id
      and stores.owner_id = auth.uid()
      and (
        stores.partner_id = public.current_approved_partner_id()
        or (
          stores.partner_id is null
          and public.current_approved_partner_id() is not null
        )
      )
  );
$$;

grant execute on function public.current_approved_partner_id() to authenticated;
grant execute on function public.is_store_managed_by_approved_partner(uuid) to authenticated;
grant execute on function public.is_store_managed_by_approved_partner(text) to authenticated;

alter table public.partners enable row level security;

drop policy if exists "Partners can view their own application" on public.partners;
create policy "Partners can view their own application"
  on public.partners for select
  to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "Owners can view their store" on public.stores;
drop policy if exists "Owners can insert their store" on public.stores;
drop policy if exists "Owners can update their store" on public.stores;
drop policy if exists "Owners can delete their store" on public.stores;
drop policy if exists "Approved partners can view their store" on public.stores;
drop policy if exists "Approved partners can insert their store" on public.stores;
drop policy if exists "Approved partners can update their store" on public.stores;
drop policy if exists "Approved partners can delete their store" on public.stores;

create policy "Approved partners can view their store"
  on public.stores for select
  to authenticated
  using (public.is_store_managed_by_approved_partner(id));

create policy "Approved partners can insert their store"
  on public.stores for insert
  to authenticated
  with check (
    owner_id = auth.uid()
    and partner_id = public.current_approved_partner_id()
  );

create policy "Approved partners can update their store"
  on public.stores for update
  to authenticated
  using (public.is_store_managed_by_approved_partner(id))
  with check (
    owner_id = auth.uid()
    and partner_id = public.current_approved_partner_id()
  );

create policy "Approved partners can delete their store"
  on public.stores for delete
  to authenticated
  using (public.is_store_managed_by_approved_partner(id));

drop policy if exists "Owners can manage their categories" on public.categories;
drop policy if exists "Approved partners can manage their categories" on public.categories;
create policy "Approved partners can manage their categories"
  on public.categories for all
  to authenticated
  using (public.is_store_managed_by_approved_partner(store_id))
  with check (public.is_store_managed_by_approved_partner(store_id));

drop policy if exists "Owners can manage their menu items" on public.menu_items;
drop policy if exists "Approved partners can manage their menu items" on public.menu_items;
create policy "Approved partners can manage their menu items"
  on public.menu_items for all
  to authenticated
  using (public.is_store_managed_by_approved_partner(store_id))
  with check (public.is_store_managed_by_approved_partner(store_id));

drop policy if exists "Owners can manage their menu item options" on public.menu_item_options;
drop policy if exists "Approved partners can manage their menu item options" on public.menu_item_options;
create policy "Approved partners can manage their menu item options"
  on public.menu_item_options for all
  to authenticated
  using (
    exists (
      select 1
      from public.menu_items
      where menu_items.id = menu_item_options.menu_item_id
        and public.is_store_managed_by_approved_partner(menu_items.store_id)
    )
  )
  with check (
    exists (
      select 1
      from public.menu_items
      where menu_items.id = menu_item_options.menu_item_id
        and public.is_store_managed_by_approved_partner(menu_items.store_id)
    )
  );

drop policy if exists "Owners can manage their photos" on public.photos;
drop policy if exists "Approved partners can manage their photos" on public.photos;
create policy "Approved partners can manage their photos"
  on public.photos for all
  to authenticated
  using (public.is_store_managed_by_approved_partner(store_id))
  with check (public.is_store_managed_by_approved_partner(store_id));

drop policy if exists "Owners can manage their business hours" on public.business_hours;
drop policy if exists "Approved partners can manage their business hours" on public.business_hours;
create policy "Approved partners can manage their business hours"
  on public.business_hours for all
  to authenticated
  using (public.is_store_managed_by_approved_partner(store_id))
  with check (public.is_store_managed_by_approved_partner(store_id));

drop policy if exists "Owners can manage their closed dates" on public.closed_dates;
drop policy if exists "Approved partners can manage their closed dates" on public.closed_dates;
create policy "Approved partners can manage their closed dates"
  on public.closed_dates for all
  to authenticated
  using (public.is_store_managed_by_approved_partner(store_id))
  with check (public.is_store_managed_by_approved_partner(store_id));

drop policy if exists "Public can view store photos" on storage.objects;
drop policy if exists "Owners can upload their store photos" on storage.objects;
drop policy if exists "Owners can update their store photos" on storage.objects;
drop policy if exists "Owners can delete their store photos" on storage.objects;
drop policy if exists "Approved partners can upload their store photos" on storage.objects;
drop policy if exists "Approved partners can update their store photos" on storage.objects;
drop policy if exists "Approved partners can delete their store photos" on storage.objects;

create policy "Public can view store photos"
  on storage.objects for select
  using (bucket_id = 'store-photos');

create policy "Approved partners can upload their store photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'store-photos'
    and public.is_store_managed_by_approved_partner((storage.foldername(name))[1])
  );

create policy "Approved partners can update their store photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'store-photos'
    and public.is_store_managed_by_approved_partner((storage.foldername(name))[1])
  );

create policy "Approved partners can delete their store photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'store-photos'
    and public.is_store_managed_by_approved_partner((storage.foldername(name))[1])
  );
