-- Allow portal admins to fully remove rejected/suspended partners and their store assets.

drop policy if exists "Partner portal admins can delete partners" on public.partners;
create policy "Partner portal admins can delete partners"
  on public.partners for delete
  to authenticated
  using (
    public.is_partner_portal_admin()
    and status in ('rejected', 'suspended')
  );

drop policy if exists "Partner portal admins can view partner stores" on public.stores;
create policy "Partner portal admins can view partner stores"
  on public.stores for select
  to authenticated
  using (public.is_partner_portal_admin());

drop policy if exists "Partner portal admins can delete partner stores" on public.stores;
create policy "Partner portal admins can delete partner stores"
  on public.stores for delete
  to authenticated
  using (public.is_partner_portal_admin());

drop policy if exists "Partner portal admins can view partner photos" on public.photos;
create policy "Partner portal admins can view partner photos"
  on public.photos for select
  to authenticated
  using (public.is_partner_portal_admin());

drop policy if exists "Partner portal admins can delete store photo files" on storage.objects;
create policy "Partner portal admins can delete store photo files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'store-photos'
    and public.is_partner_portal_admin()
  );
