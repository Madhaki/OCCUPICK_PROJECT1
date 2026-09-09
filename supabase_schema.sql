-- OccuPick Phase 2: profiles + tasks + RLS
-- Run this after the original Phase 1 SQL. It is safe to run more than once.

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

-- Keep profile data private to signed-in users while allowing profile discovery.
drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
create policy "Profiles are viewable by authenticated users" on public.profiles
for select to authenticated using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles
for insert to authenticated with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Anyone signed in can browse open tasks.
drop policy if exists "Authenticated users can view open tasks" on public.tasks;
create policy "Authenticated users can view open tasks" on public.tasks
for select to authenticated using (status = 'open' or auth.uid() = client_id);

-- Only profiles whose role is client may create tasks.
drop policy if exists "Clients can create their own tasks" on public.tasks;
create policy "Clients can create their own tasks" on public.tasks
for insert to authenticated
with check (
  auth.uid() = client_id
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'client')
);

drop policy if exists "Clients can update their own tasks" on public.tasks;
create policy "Clients can update their own tasks" on public.tasks
for update to authenticated using (auth.uid() = client_id) with check (auth.uid() = client_id);

drop policy if exists "Clients can delete their own tasks" on public.tasks;
create policy "Clients can delete their own tasks" on public.tasks
for delete to authenticated using (auth.uid() = client_id);

-- Keep the profile trigger in place for new accounts.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    case when new.raw_user_meta_data->>'role' in ('worker','client') then new.raw_user_meta_data->>'role' else 'worker' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
