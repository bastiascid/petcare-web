-- Conserva los IDs históricos usados por mascotas y fichas, y enlaza el perfil con Supabase Auth.
alter table public.users add column if not exists auth_id uuid unique references auth.users(id) on delete set null;

update public.users profile
set auth_id = account.id
from auth.users account
where profile.auth_id is null
  and lower(profile.email) = lower(account.email);

create or replace function public.current_role() returns text language sql stable security definer set search_path = public as $$
  select role from public.users where auth_id = auth.uid()
$$;

create or replace function public.create_profile_from_auth() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, auth_id, name, email, role)
  values (new.id, new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.email, 'OWNER')
  on conflict (auth_id) do nothing;
  return new;
end;
$$;

drop policy if exists "users: own profile or admins" on public.users;
drop policy if exists "users: admins manage roles" on public.users;
create policy "users: own profile or admins" on public.users for select to authenticated using (auth_id = auth.uid() or public.is_admin());
create policy "users: admins manage roles" on public.users for update to authenticated using (public.is_admin()) with check (public.is_admin());
