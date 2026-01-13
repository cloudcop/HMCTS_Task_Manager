-- Run this in your Supabase SQL Editor

-- Create Tables
create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text not null default 'NEW',
  priority text not null default 'MEDIUM',
  due_date_time timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table tasks enable row level security;

-- Create Policy: Allow Public Read/Write (For Demo Purposes)
-- In a real production app, you would restrict this to authenticated users
create policy "Public Access"
on tasks
for all
using (true)
with check (true);