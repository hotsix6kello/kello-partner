-- Tighten public catalog reads to visible, approved partner stores only.

create index if not exists partners_status_visibility_idx
  on public.partners (status, visibility_status);

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
        and partners.visibility_status = true
    )
  );

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
        and partners.visibility_status = true
    )
  );

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
        and partners.visibility_status = true
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
        and partners.visibility_status = true
    )
  );

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
        and partners.visibility_status = true
    )
  );

drop policy if exists "Public can view approved store business hours" on public.business_hours;
create policy "Public can view approved store business hours"
  on public.business_hours for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.stores
      join public.partners on partners.id = stores.partner_id
      where stores.id = business_hours.store_id
        and lower(partners.status) = 'approved'
        and partners.visibility_status = true
    )
  );

drop policy if exists "Public can view approved store closed dates" on public.closed_dates;
create policy "Public can view approved store closed dates"
  on public.closed_dates for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.stores
      join public.partners on partners.id = stores.partner_id
      where stores.id = closed_dates.store_id
        and lower(partners.status) = 'approved'
        and partners.visibility_status = true
    )
  );
