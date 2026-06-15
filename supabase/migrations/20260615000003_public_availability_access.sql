-- Allow public availability calculation to read schedules for approved partner stores.

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
    )
  );
