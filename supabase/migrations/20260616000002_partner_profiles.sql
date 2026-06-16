create table public.partner_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  name text not null default '',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.partner_profiles enable row level security;

create policy "Users can view their own partner profile"
  on public.partner_profiles for select to authenticated
  using (auth.uid() = id);

create policy "Users can insert their own partner profile"
  on public.partner_profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own partner profile"
  on public.partner_profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace view public.partner_profiles_ko as
  select
    id as "사용자ID",
    email as "이메일",
    name as "성함",
    is_admin as "관리자여부",
    created_at as "생성일시"
  from public.partner_profiles;
