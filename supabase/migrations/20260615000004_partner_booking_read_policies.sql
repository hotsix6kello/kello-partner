-- Allow approved partners to view only booking requests tied to their own store.
-- booking_records is intentionally not used here because it has no store_id.

do $$
begin
  if to_regclass('public.beauty_booking_requests') is not null then
    execute 'alter table public.beauty_booking_requests enable row level security';

    execute 'drop policy if exists "Approved partners can view their store booking requests" on public.beauty_booking_requests';
    execute $policy$
      create policy "Approved partners can view their store booking requests"
        on public.beauty_booking_requests for select
        to authenticated
        using (public.is_store_managed_by_approved_partner(store_id))
    $policy$;

    execute 'create index if not exists beauty_booking_requests_store_date_idx on public.beauty_booking_requests (store_id, booking_date, booking_time)';
  end if;

  if to_regclass('public.beauty_booking_request_images') is not null then
    execute 'alter table public.beauty_booking_request_images enable row level security';

    execute 'drop policy if exists "Approved partners can view their store booking request images" on public.beauty_booking_request_images';
    execute $policy$
      create policy "Approved partners can view their store booking request images"
        on public.beauty_booking_request_images for select
        to authenticated
        using (
          exists (
            select 1
            from public.beauty_booking_requests
            where beauty_booking_requests.id = beauty_booking_request_images.request_id
              and public.is_store_managed_by_approved_partner(beauty_booking_requests.store_id)
          )
        )
    $policy$;

    execute 'create index if not exists beauty_booking_request_images_request_id_idx on public.beauty_booking_request_images (request_id)';
  end if;
end $$;
