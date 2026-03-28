-- ============================================================
-- LankaChat Database Schema
-- Run this in Supabase SQL Editor (Database → SQL Editor)
-- ============================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- Chat Rooms (admin-created)
create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz default now()
);

-- Messages (public rooms + private DMs)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  sender_username text not null,
  receiver_username text,  -- null = public room message, set = private DM
  content text not null,
  created_at timestamptz default now()
);

-- Blog Posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contact Submissions
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table rooms enable row level security;
alter table messages enable row level security;
alter table posts enable row level security;
alter table contacts enable row level security;

-- Rooms: anyone can read, only service_role can write
create policy "rooms_public_read" on rooms for select using (true);
create policy "rooms_service_insert" on rooms for insert with check (false); -- use service role
create policy "rooms_service_update" on rooms for update using (false);
create policy "rooms_service_delete" on rooms for delete using (false);

-- Messages: anyone can read and insert (guest chat), only service can delete
create policy "messages_public_read" on messages for select using (true);
create policy "messages_public_insert" on messages for insert with check (true);
create policy "messages_service_delete" on messages for delete using (false);

-- Posts: anyone can read published, only service_role writes
create policy "posts_public_read" on posts for select using (published = true);
create policy "posts_service_insert" on posts for insert with check (false);
create policy "posts_service_update" on posts for update using (false);
create policy "posts_service_delete" on posts for delete using (false);

-- Contacts: only insert from public, no read
create policy "contacts_public_insert" on contacts for insert with check (true);
create policy "contacts_no_read" on contacts for select using (false);

-- ============================================================
-- UPDATE TRIGGER FOR posts.updated_at
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_messages_room_id on messages(room_id);
create index if not exists idx_messages_created_at on messages(created_at desc);
create index if not exists idx_messages_dm on messages(sender_username, receiver_username);
create index if not exists idx_posts_slug on posts(slug);
create index if not exists idx_posts_published on posts(published, created_at desc);

-- ============================================================
-- REALTIME
-- Enable realtime for messages table
-- ============================================================

-- Run this to enable realtime on messages:
alter publication supabase_realtime add table messages;

-- ============================================================
-- SEED DATA — Default Rooms
-- ============================================================

insert into rooms (name, description) values
  ('General', 'General chat for everyone'),
  ('Sri Lanka', 'Talk about Sri Lanka 🇱🇰'),
  ('Tech Talk', 'Discuss technology and programming'),
  ('Off Topic', 'Anything goes here!')
on conflict (name) do nothing;

-- ============================================================
-- AUTO-DELETE OLD MESSAGES (pg_cron)
-- Requires: Database → Extensions → enable pg_cron first
-- Then run this:
-- ============================================================

-- select cron.schedule(
--   'delete-old-messages',
--   '0 * * * *',
--   $$delete from messages where created_at < now() - interval '1 day'$$
-- );
