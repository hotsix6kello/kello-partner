-- Reframe the partner portal around partnership management, not booking handling.

alter table public.partners
  add column if not exists is_public boolean not null default false,
  add column if not exists contract_status text not null default 'not_started';

alter type public.business_type add value if not exists 'semipermanent' after 'waxing';

update public.partners
set
  status = case
    when lower(coalesce(status, '')) in ('draft', 'pending_review', 'needs_revision', 'approved', 'rejected', 'suspended') then lower(status)
    when lower(coalesce(status, '')) = 'pending' then 'pending_review'
    when lower(coalesce(status, '')) in ('revision', 'needs_revisions', 'need_revision') then 'needs_revision'
    else 'pending_review'
  end,
  is_public = coalesce(is_public, visibility_status, false),
  contract_status = case
    when lower(coalesce(contract_status, '')) in ('not_started', 'pending', 'signed', 'expired', 'terminated') then lower(contract_status)
    else 'not_started'
  end;

alter table public.partners
  drop constraint if exists partners_status_allowed,
  add constraint partners_status_allowed
    check (status in ('draft', 'pending_review', 'needs_revision', 'approved', 'rejected', 'suspended'));

alter table public.partners
  drop constraint if exists partners_contract_status_allowed,
  add constraint partners_contract_status_allowed
    check (contract_status in ('not_started', 'pending', 'signed', 'expired', 'terminated'));

create index if not exists partners_status_public_idx
  on public.partners (status, contract_status, is_public);

create or replace function public.is_partner_portal_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.partner_profiles
    where partner_profiles.id = auth.uid()
      and partner_profiles.is_admin = true
  );
$$;

grant execute on function public.is_partner_portal_admin() to authenticated;

drop policy if exists "Partner portal admins can view all partners" on public.partners;
create policy "Partner portal admins can view all partners"
  on public.partners for select
  to authenticated
  using (public.is_partner_portal_admin());

drop policy if exists "Partner portal admins can update all partners" on public.partners;
create policy "Partner portal admins can update all partners"
  on public.partners for update
  to authenticated
  using (public.is_partner_portal_admin())
  with check (public.is_partner_portal_admin());

drop policy if exists "Partners can reapply after rejection" on public.partners;
create policy "Partners can reapply after rejection"
  on public.partners for update
  to authenticated
  using (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and status in ('draft', 'needs_revision', 'rejected')
  )
  with check (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and status = 'pending_review'
  );

do $$
begin
  if to_regclass('public.beauty_booking_requests') is not null then
    alter table public.beauty_booking_requests
      add column if not exists partner_visit_status text;

    alter table public.beauty_booking_requests
      drop constraint if exists beauty_booking_requests_partner_visit_status_allowed,
      add constraint beauty_booking_requests_partner_visit_status_allowed
        check (partner_visit_status is null or partner_visit_status in ('completed', 'no_show'));

    create index if not exists beauty_booking_requests_store_visit_status_idx
      on public.beauty_booking_requests (store_id, status, partner_visit_status);

    drop policy if exists "Approved partners can update visit confirmation" on public.beauty_booking_requests;
    create policy "Approved partners can update visit confirmation"
      on public.beauty_booking_requests for update
      to authenticated
      using (
        public.is_store_managed_by_approved_partner(store_id)
        and status in ('confirmed', 'confirmed_by_admin', 'scheduled', 'paid', '예약확정')
      )
      with check (
        public.is_store_managed_by_approved_partner(store_id)
        and status in ('confirmed', 'confirmed_by_admin', 'scheduled', 'paid', '예약확정')
      );
  end if;
end $$;

drop policy if exists "Public can view approved partner stores" on public.stores;
create policy "Public can view approved partner stores"
  on public.stores for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.partners
      where partners.id = stores.partner_id
        and partners.status = 'approved'
        and partners.contract_status = 'signed'
        and partners.is_public = true
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
        and partners.status = 'approved'
        and partners.contract_status = 'signed'
        and partners.is_public = true
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
        and partners.status = 'approved'
        and partners.contract_status = 'signed'
        and partners.is_public = true
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
        and partners.status = 'approved'
        and partners.contract_status = 'signed'
        and partners.is_public = true
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
        and partners.status = 'approved'
        and partners.contract_status = 'signed'
        and partners.is_public = true
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
        and partners.status = 'approved'
        and partners.contract_status = 'signed'
        and partners.is_public = true
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
        and partners.status = 'approved'
        and partners.contract_status = 'signed'
        and partners.is_public = true
    )
  );
