-- Platform tables for the course platform (programs). Distinct from magisterium's credentialing
-- schema — these back membership pricing, the GitHub connect flow, and enrollment. If programs
-- shares magisterium's Supabase project, coordinate migration ordering; otherwise this is the
-- platform project's first migration.

create extension if not exists "pgcrypto";

-- Castalia members → $0 course checkout (fails closed if absent). Read by lib/membership.ts.
create table if not exists members (
  id           uuid primary key default gen_random_uuid(),
  github_login text unique not null,
  email        text,
  status       text not null default 'active',   -- 'active' | 'inactive'
  created_at   timestamptz default now()
);

-- Verified GitHub connections from /api/github/callback (individual OAuth or org install).
create table if not exists github_connections (
  id              uuid primary key default gen_random_uuid(),
  kind            text not null,                  -- 'individual' | 'institutional'
  github_login    text,                           -- individual
  github_id       bigint,
  orgs            text[] default '{}',            -- individual: orgs the user belongs to
  org             text,                           -- institutional: verified installed org
  installation_id text,                           -- institutional: App installation
  connect_state   text,
  created_at      timestamptz default now()
);
create unique index if not exists ux_github_connections_login
  on github_connections(github_login) where github_login is not null;

-- Enrollment = access + provisioned environment (NOT a credential). Durable record; the webhook
-- may currently write a KV mirror for idempotency, but this is the system of record for access.
create table if not exists enrollments (
  id            uuid primary key default gen_random_uuid(),
  course_code   text not null,                    -- magisterium canonical code (e.g. AI-103)
  github_login  text not null,
  purchase_type text not null default 'individual',
  org           text,
  repo          text,
  inqspace_url  text,
  stripe_event  text,
  created_at    timestamptz default now(),
  unique (course_code, github_login)
);

-- Webhook idempotency (durable alternative to the KV `evt:` key).
create table if not exists processed_events (
  event_id   text primary key,
  created_at timestamptz default now()
);

-- RLS: writes are service-role only (the Functions use the service key). No public policies →
-- anon cannot read/write. Add scoped read policies later if a learner UI needs them.
alter table members enable row level security;
alter table github_connections enable row level security;
alter table enrollments enable row level security;
alter table processed_events enable row level security;
