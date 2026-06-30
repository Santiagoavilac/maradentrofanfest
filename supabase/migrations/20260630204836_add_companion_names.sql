alter table public.registrations
  add column if not exists companion_names text[] not null default '{}',
  add column if not exists checked_out_at timestamptz null;

comment on column public.registrations.companion_names is 'Names entered for registered companions.';
comment on column public.registrations.checked_out_at is 'Time when an admin marks the attendee as checked out.';
