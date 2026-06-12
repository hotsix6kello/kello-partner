-- Shared enum types and helper trigger function reused across partner portal tables.

create type public.business_type as enum (
  'hair',
  'nail',
  'eyelash',
  'makeup',
  'esthetic',
  'waxing'
);

create type public.price_type as enum (
  'fixed',
  'from',
  'range'
);

create type public.review_status as enum (
  'pending',
  'approved',
  'rejected'
);

create type public.photo_slot_type as enum (
  'representative',
  'interior',
  'treatment'
);

-- Keeps `updated_at` in sync on every row update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
