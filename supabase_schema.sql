-- D-Day Events Table Schema
create table public.d_day_events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Optional: user_id for row level security if auth is implemented
  user_id uuid references auth.users
);

-- RLS Policy (Optional: If you want to restrict access to own data)
alter table public.d_day_events enable row level security;

create policy "Users can view their own events"
on public.d_day_events for select
using ( auth.uid() = user_id );

create policy "Users can insert their own events"
on public.d_day_events for insert
with check ( auth.uid() = user_id );

create policy "Users can update their own events"
on public.d_day_events for update
using ( auth.uid() = user_id );

create policy "Users can delete their own events"
on public.d_day_events for delete
using ( auth.uid() = user_id );
