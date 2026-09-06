insert into public.user_roles (user_id, role)
values ('bf153562-4125-4a63-9c1b-8f41dd6cd1ea', 'admin')
on conflict (user_id, role) do nothing;

alter table public.itineraries add column if not exists cover_image_url text;

create table if not exists public.destination_covers (
  slug text primary key,
  destination text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

grant select on public.destination_covers to anon;
grant select on public.destination_covers to authenticated;
grant all on public.destination_covers to service_role;

alter table public.destination_covers enable row level security;

create policy "Destination covers are readable by everyone"
on public.destination_covers for select
to anon, authenticated
using (true);