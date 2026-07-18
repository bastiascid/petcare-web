-- PETCARE: ejecutar en Supabase SQL Editor antes del despliegue público.
-- Requiere que public.users.id sea uuid y corresponda a auth.users.id.
alter table public.users enable row level security;
alter table public.clinics enable row level security;
alter table public.pets enable row level security;
alter table public.alerts enable row level security;
alter table public.adoptions enable row level security;
alter table public.appointments enable row level security;
alter table public.medical_records enable row level security;
alter table public.staff_doctors enable row level security;

create or replace function public.current_role() returns text language sql stable security definer set search_path = public as $$
  select role from public.users where id = auth.uid()
$$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select public.current_role() = 'ADMIN'
$$;

-- Profiles are created only from Auth. Signup always starts as OWNER; role changes require an admin policy.
create or replace function public.create_profile_from_auth() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.email, 'OWNER')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists create_profile_on_auth_user on auth.users;
create trigger create_profile_on_auth_user after insert on auth.users for each row execute procedure public.create_profile_from_auth();

-- Idempotencia: una ejecución anterior puede haber creado solo parte de las políticas.
drop policy if exists "users: own profile or admins" on public.users;
drop policy if exists "users: admins manage roles" on public.users;
drop policy if exists "clinics: authenticated view" on public.clinics;
drop policy if exists "clinics: admin manage" on public.clinics;
drop policy if exists "pets: owner reads and manages" on public.pets;
drop policy if exists "alerts: sender or receiver" on public.alerts;
drop policy if exists "alerts: sender creates" on public.alerts;
drop policy if exists "alerts: receiver updates" on public.alerts;
drop policy if exists "adoptions: authenticated view" on public.adoptions;
drop policy if exists "adoptions: owner manages" on public.adoptions;
drop policy if exists "appointments: related users" on public.appointments;
drop policy if exists "appointments: owners create" on public.appointments;
drop policy if exists "staff: clinic owner manages" on public.staff_doctors;
drop policy if exists "records: owner or clinic" on public.medical_records;
drop policy if exists "records: clinic creates" on public.medical_records;

create policy "users: own profile or admins" on public.users for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "users: admins manage roles" on public.users for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "clinics: authenticated view" on public.clinics for select to authenticated using (true);
create policy "clinics: admin manage" on public.clinics for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "pets: owner reads and manages" on public.pets for all to authenticated using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());
create policy "alerts: sender or receiver" on public.alerts for select to authenticated using (sender_id = auth.uid() or receiver_id = auth.uid() or public.is_admin());
create policy "alerts: sender creates" on public.alerts for insert to authenticated with check (sender_id = auth.uid() or public.is_admin());
create policy "alerts: receiver updates" on public.alerts for update to authenticated using (receiver_id = auth.uid() or public.is_admin()) with check (receiver_id = auth.uid() or public.is_admin());
create policy "adoptions: authenticated view" on public.adoptions for select to authenticated using (true);
create policy "adoptions: owner manages" on public.adoptions for all to authenticated using (creator_id = auth.uid() or public.is_admin()) with check (creator_id = auth.uid() or public.is_admin());
create policy "appointments: related users" on public.appointments for select to authenticated using (owner_id = auth.uid() or public.is_admin() or clinic_id in (select id from public.clinics where owner_id = auth.uid()));
create policy "appointments: owners create" on public.appointments for insert to authenticated with check (owner_id = auth.uid());
create policy "staff: clinic owner manages" on public.staff_doctors for all to authenticated using (clinic_id in (select id from public.clinics where owner_id = auth.uid()) or public.is_admin()) with check (clinic_id in (select id from public.clinics where owner_id = auth.uid()) or public.is_admin());
create policy "records: owner or clinic" on public.medical_records for select to authenticated using (public.is_admin() or pet_id in (select id from public.pets where owner_id = auth.uid()) or clinic_id in (select id from public.clinics where owner_id = auth.uid()));
create policy "records: clinic creates" on public.medical_records for insert to authenticated with check (public.is_admin() or clinic_id in (select id from public.clinics where owner_id = auth.uid()));
