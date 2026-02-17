create table if not exists newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table newsletter_subscribers enable row level security;

-- Allow public access to insert (anyone can subscribe)
create policy "Allow public insert to newsletter_subscribers"
  on newsletter_subscribers
  for insert
  with check (true);

-- Allow admins to view subscribers (optional, requires admin rule existing or check user role)
-- For now, we'll just allow service role or authenticated admins if we had that set up fully in RLS for this table.
-- Assuming service role usage for dashboard or admin checks.
