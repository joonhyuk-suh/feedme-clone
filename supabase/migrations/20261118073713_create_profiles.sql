-- One profile row per Auth user, following Supabase's user-management pattern.
create table public.profiles (
  id uuid not null references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 50),
  updated_at timestamptz not null default now(),

  primary key (id)
);

-- Owner-only access. Rows are created by the trigger below and removed by the
-- cascade from auth.users, so signed-in users only need to read and update.
revoke all on public.profiles from anon, authenticated;
grant select, update (display_name, updated_at) on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Create a profile whenever a new Auth user is created.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, left(new.raw_user_meta_data ->> 'display_name', 50));
  return new;
end;
$$;

-- Only the trigger should run this function; keep it off the Data API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
