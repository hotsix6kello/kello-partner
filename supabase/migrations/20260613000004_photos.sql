-- Fixed photo slots per store: 1 representative (4:3 crop), 3 interior, 4 treatment.

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  slot_type public.photo_slot_type not null,
  slot_index integer not null default 0,
  storage_path text,
  category_id uuid references public.categories (id) on delete set null,
  crop jsonb,
  order_index integer not null default 0,
  review_status public.review_status not null default 'pending',
  review_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint photos_slot_index_range check (
    case slot_type
      when 'representative' then slot_index = 0
      when 'interior' then slot_index between 1 and 3
      when 'treatment' then slot_index between 1 and 4
    end
  ),
  constraint photos_category_tag_treatment_only check (
    slot_type = 'treatment' or category_id is null
  ),
  unique (store_id, slot_type, slot_index)
);

create index photos_store_id_idx on public.photos (store_id);
create index photos_category_id_idx on public.photos (category_id);

create trigger set_photos_updated_at
  before update on public.photos
  for each row
  execute function public.set_updated_at();

-- An approved photo that gets replaced/re-tagged goes back to "pending" review.
create or replace function public.reset_photo_review_status()
returns trigger
language plpgsql
as $$
begin
  if old.review_status = 'approved'
     and new.review_status = old.review_status
     and (
       new.storage_path is distinct from old.storage_path
       or new.category_id is distinct from old.category_id
       or new.crop is distinct from old.crop
     )
  then
    new.review_status = 'pending';
    new.review_reason = null;
  end if;

  return new;
end;
$$;

create trigger photos_reset_review_status
  before update on public.photos
  for each row
  execute function public.reset_photo_review_status();

alter table public.photos enable row level security;

create policy "Owners can manage their photos"
  on public.photos for all
  using (
    exists (
      select 1 from public.stores
      where stores.id = photos.store_id
        and stores.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.stores
      where stores.id = photos.store_id
        and stores.owner_id = auth.uid()
    )
  );

-- Storage bucket ---------------------------------------------------------
-- Objects are stored under `{store_id}/{slot_type}/{slot_index}-...` so
-- ownership can be checked from the path's first folder segment.

insert into storage.buckets (id, name, public)
values ('store-photos', 'store-photos', true)
on conflict (id) do nothing;

create policy "Public can view store photos"
  on storage.objects for select
  using (bucket_id = 'store-photos');

create policy "Owners can upload their store photos"
  on storage.objects for insert
  with check (
    bucket_id = 'store-photos'
    and exists (
      select 1 from public.stores
      where stores.id::text = (storage.foldername(name))[1]
        and stores.owner_id = auth.uid()
    )
  );

create policy "Owners can update their store photos"
  on storage.objects for update
  using (
    bucket_id = 'store-photos'
    and exists (
      select 1 from public.stores
      where stores.id::text = (storage.foldername(name))[1]
        and stores.owner_id = auth.uid()
    )
  );

create policy "Owners can delete their store photos"
  on storage.objects for delete
  using (
    bucket_id = 'store-photos'
    and exists (
      select 1 from public.stores
      where stores.id::text = (storage.foldername(name))[1]
        and stores.owner_id = auth.uid()
    )
  );
