alter table public.registrations
  add column if not exists guest_type text not null default 'regular' check (guest_type in ('regular', 'special'));

create index if not exists registrations_guest_type_idx on public.registrations (guest_type);

create policy "Authenticated admins can create registrations"
  on public.registrations
  for insert
  to authenticated
  with check (status = 'registered' and checked_in_at is null and guest_type in ('regular', 'special'));

create or replace function public.scan_registration_qr(input_code text)
returns table (
  result_type text,
  first_name text,
  last_name text,
  guest_type text,
  checked_in_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  found_registration public.registrations%rowtype;
  now_checked timestamptz := now();
begin
  select *
    into found_registration
  from public.registrations
  where qr_code = input_code
  limit 1;

  if not found then
    result_type := 'invalid';
    first_name := null;
    last_name := null;
    guest_type := null;
    checked_in_at := null;
    return next;
    return;
  end if;

  if found_registration.status = 'checked_in' then
    result_type := 'used';
    first_name := found_registration.first_name;
    last_name := found_registration.last_name;
    guest_type := found_registration.guest_type;
    checked_in_at := found_registration.checked_in_at;
    return next;
    return;
  end if;

  update public.registrations
    set status = 'checked_in', checked_in_at = now_checked
  where id = found_registration.id;

  result_type := 'valid';
  first_name := found_registration.first_name;
  last_name := found_registration.last_name;
  guest_type := found_registration.guest_type;
  checked_in_at := now_checked;
  return next;
end;
$$;

revoke all on function public.scan_registration_qr(text) from public;
grant execute on function public.scan_registration_qr(text) to anon, authenticated;
