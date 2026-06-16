-- Allow logged-in users to submit a partner application and re-apply after rejection.

drop policy if exists "Users can apply as a partner" on public.partners;
create policy "Users can apply as a partner"
  on public.partners for insert
  to authenticated
  with check (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Only rejected partners can update their own row, and only back to pending.
drop policy if exists "Partners can reapply after rejection" on public.partners;
create policy "Partners can reapply after rejection"
  on public.partners for update
  to authenticated
  using (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and lower(status) = 'rejected'
  )
  with check (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and lower(status) = 'pending'
  );
