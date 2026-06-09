create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text null,
  document_id text null,
  companions integer not null default 0 check (companions between 0 and 1),
  qr_code text unique not null,
  status text not null default 'registered' check (status in ('registered', 'checked_in')),
  created_at timestamptz not null default now(),
  checked_in_at timestamptz null
);

create index if not exists registrations_qr_code_idx on public.registrations (qr_code);
create index if not exists registrations_phone_idx on public.registrations (phone);
create index if not exists registrations_status_idx on public.registrations (status);
create index if not exists registrations_created_at_idx on public.registrations (created_at desc);

alter table public.registrations enable row level security;

grant insert on table public.registrations to anon;
grant select, insert, update on table public.registrations to authenticated;
grant select, insert, update, delete on table public.registrations to service_role;

create policy "Public can create fan fest registrations"
  on public.registrations
  for insert
  to anon
  with check (status = 'registered' and checked_in_at is null);

create policy "Authenticated admins can read registrations"
  on public.registrations
  for select
  to authenticated
  using (true);

create policy "Authenticated admins can update check-in state"
  on public.registrations
  for update
  to authenticated
  using (true)
  with check (status in ('registered', 'checked_in'));

comment on table public.registrations is 'Fan Fest Mundial 2026 registrations. RLS allows public inserts and authenticated admin reads/check-ins. Do not expose service_role in the browser.';
