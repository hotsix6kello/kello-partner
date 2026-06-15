-- Keep partner-authored menu and photo changes out of public surfaces until review.

alter table public.menu_items
  add column if not exists review_status public.review_status not null default 'pending',
  add column if not exists review_reason text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users (id) on delete set null;

alter table public.photos
  add column if not exists review_status public.review_status not null default 'pending',
  add column if not exists review_reason text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users (id) on delete set null;

alter table public.menu_items
  alter column review_status set default 'pending';

alter table public.photos
  alter column review_status set default 'pending';

update public.menu_items
set review_status = 'pending'
where review_status is null;

update public.photos
set review_status = 'pending'
where review_status is null;

alter table public.menu_items
  alter column review_status set not null;

alter table public.photos
  alter column review_status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'menu_items_review_status_allowed'
      and conrelid = 'public.menu_items'::regclass
  ) then
    alter table public.menu_items
      add constraint menu_items_review_status_allowed
      check (review_status::text in ('pending', 'approved', 'rejected'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'photos_review_status_allowed'
      and conrelid = 'public.photos'::regclass
  ) then
    alter table public.photos
      add constraint photos_review_status_allowed
      check (review_status::text in ('pending', 'approved', 'rejected'));
  end if;
end $$;

create or replace function public.is_partner_review_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and (
        profiles.is_admin = true
        or profiles.role in ('admin', 'super_admin')
      )
  );
$$;

grant execute on function public.is_partner_review_admin() to authenticated;

create or replace function public.force_partner_content_pending()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_partner_review_admin() then
    if tg_op = 'INSERT' and new.review_status is null then
      new.review_status = 'pending';
    end if;

    return new;
  end if;

  new.review_status = 'pending';
  new.review_reason = null;
  new.reviewed_at = null;
  new.reviewed_by = null;

  return new;
end;
$$;

drop trigger if exists menu_items_reset_review_status on public.menu_items;
drop trigger if exists photos_reset_review_status on public.photos;
drop trigger if exists menu_items_force_partner_content_pending on public.menu_items;
drop trigger if exists photos_force_partner_content_pending on public.photos;

create trigger menu_items_force_partner_content_pending
  before insert or update on public.menu_items
  for each row
  execute function public.force_partner_content_pending();

create trigger photos_force_partner_content_pending
  before insert or update on public.photos
  for each row
  execute function public.force_partner_content_pending();

drop policy if exists "Review admins can view stores" on public.stores;
create policy "Review admins can view stores"
  on public.stores for select
  to authenticated
  using (public.is_partner_review_admin());

drop policy if exists "Public can view approved partner stores" on public.stores;
create policy "Public can view approved partner stores"
  on public.stores for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.partners
      where partners.id = stores.partner_id
        and lower(partners.status) = 'approved'
    )
  );

drop policy if exists "Review admins can view categories" on public.categories;
create policy "Review admins can view categories"
  on public.categories for select
  to authenticated
  using (public.is_partner_review_admin());

drop policy if exists "Public can view approved store categories" on public.categories;
create policy "Public can view approved store categories"
  on public.categories for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.stores
      join public.partners on partners.id = stores.partner_id
      where stores.id = categories.store_id
        and lower(partners.status) = 'approved'
    )
  );

drop policy if exists "Review admins can review menu items" on public.menu_items;
create policy "Review admins can review menu items"
  on public.menu_items for update
  to authenticated
  using (public.is_partner_review_admin())
  with check (public.is_partner_review_admin());

drop policy if exists "Review admins can view menu items" on public.menu_items;
create policy "Review admins can view menu items"
  on public.menu_items for select
  to authenticated
  using (public.is_partner_review_admin());

drop policy if exists "Public can view approved visible menu items" on public.menu_items;
create policy "Public can view approved visible menu items"
  on public.menu_items for select
  to anon, authenticated
  using (
    visible = true
    and review_status::text = 'approved'
    and exists (
      select 1
      from public.stores
      join public.partners on partners.id = stores.partner_id
      where stores.id = menu_items.store_id
        and lower(partners.status) = 'approved'
    )
  );

drop policy if exists "Public can view approved menu item options" on public.menu_item_options;
create policy "Public can view approved menu item options"
  on public.menu_item_options for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.menu_items
      join public.stores on stores.id = menu_items.store_id
      join public.partners on partners.id = stores.partner_id
      where menu_items.id = menu_item_options.menu_item_id
        and menu_items.visible = true
        and menu_items.review_status::text = 'approved'
        and lower(partners.status) = 'approved'
    )
  );

drop policy if exists "Review admins can review photos" on public.photos;
create policy "Review admins can review photos"
  on public.photos for update
  to authenticated
  using (public.is_partner_review_admin())
  with check (public.is_partner_review_admin());

drop policy if exists "Review admins can view photos" on public.photos;
create policy "Review admins can view photos"
  on public.photos for select
  to authenticated
  using (public.is_partner_review_admin());

drop policy if exists "Public can view approved photos" on public.photos;
create policy "Public can view approved photos"
  on public.photos for select
  to anon, authenticated
  using (
    review_status::text = 'approved'
    and exists (
      select 1
      from public.stores
      join public.partners on partners.id = stores.partner_id
      where stores.id = photos.store_id
        and lower(partners.status) = 'approved'
    )
  );
