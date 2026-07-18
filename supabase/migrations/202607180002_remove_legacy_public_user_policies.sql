-- Elimina políticas heredadas que permitían leer o insertar perfiles sin sesión.
-- Los perfiles se crean exclusivamente desde auth.users mediante el trigger de la migración anterior.
drop policy if exists "Permitir lectura" on public.users;
drop policy if exists "Permitir insercion" on public.users;

-- Las tablas sensibles deben mantener RLS incluso cuando las consulta su propietario.
alter table public.users force row level security;
alter table public.pets force row level security;
alter table public.alerts force row level security;
alter table public.appointments force row level security;
alter table public.medical_records force row level security;
