-- Basic store profile fields shown on the partner-facing listing page.

alter table public.stores
  add column description text not null default '',
  add column phone text not null default '',
  add column address text not null default '';
