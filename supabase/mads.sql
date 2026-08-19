-- M Ads tables only. Safe to run in the shared uc8Video Supabase project.
-- Everything is prefixed with mads_ to avoid collisions.

create extension if not exists pgcrypto;

create table if not exists public.mads_sites (
  id text primary key default ('site_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  name text not null check (char_length(name) between 1 and 80),
  domain text not null check (char_length(domain) between 1 and 180),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists mads_sites_domain_unique on public.mads_sites (lower(domain));

create table if not exists public.mads_ads (
  id text primary key default ('ad_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  name text not null check (char_length(name) between 1 and 80),
  headline text not null default '' check (char_length(headline) <= 120),
  description text not null default '' check (char_length(description) <= 240),
  image_url text,
  destination_url text not null default '' check (char_length(destination_url) <= 500),
  button_label text not null default 'Learn more' check (char_length(button_label) <= 40),
  format text not null default 'mixed' check (format in ('text', 'image', 'mixed', 'custom')),
  custom_html text,
  wait_seconds integer not null default 3 check (wait_seconds between 0 and 30),
  active boolean not null default true,
  weight integer not null default 100 check (weight between 1 and 1000),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists mads_ads_deleted_at_idx on public.mads_ads (deleted_at);

create table if not exists public.mads_events (
  id bigint generated always as identity primary key,
  type text not null check (type in ('impression', 'click')),
  site_id text not null references public.mads_sites(id) on delete cascade,
  ad_id text not null references public.mads_ads(id) on delete cascade,
  placement text check (placement is null or char_length(placement) <= 80),
  created_at timestamptz not null default now()
);

create index if not exists mads_events_created_at_idx on public.mads_events (created_at desc);
create index if not exists mads_events_site_idx on public.mads_events (site_id);
create index if not exists mads_events_ad_idx on public.mads_events (ad_id);
create index if not exists mads_events_type_idx on public.mads_events (type);

alter table public.mads_sites enable row level security;
alter table public.mads_ads enable row level security;
alter table public.mads_events enable row level security;

-- No anon/authenticated policies are intentionally created.
-- The Vercel server uses a Supabase service-role/secret key, which bypasses RLS.
