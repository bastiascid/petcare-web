# PETCARE PRO

Portal web para dueños de mascotas, clínicas veterinarias y administración. Implementado con React, TypeScript, Vite y Supabase (Auth + Postgres).

## Desarrollo local

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Completa en `.env` los valores de `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. No uses ni expongas `SUPABASE_SERVICE_ROLE_KEY` en el frontend.

Para validar el artefacto de producción:

```powershell
npm run build
```

## Seguridad y despliegue

1. Ejecuta [supabase/migrations/202607180001_security.sql](supabase/migrations/202607180001_security.sql) en el SQL Editor de Supabase. Activa RLS y crea perfiles desde `auth.users`.
2. Despliega las invitaciones administrativas:

   ```powershell
   supabase functions deploy invite-user
   ```

   Configura `SUPABASE_SERVICE_ROLE_KEY` únicamente como secreto de esa función.
3. Crea o migra usuarios usando Supabase Auth. Cada `public.users.id` debe ser el mismo UUID de `auth.users.id`. Las cuentas anteriores basadas solo en email no son un mecanismo de acceso válido.
4. En **Authentication > Providers > Email**, activa confirmación de correo, rate limiting y protección contra contraseñas filtradas.
5. En Vercel, configura las dos variables `VITE_*` en Production, Preview y Development. El proyecto ya dispone de la reescritura SPA necesaria.

La aplicación protege las pantallas por rol (`OWNER`, `VET`, `ADMIN`) y la migración aplica el aislamiento de datos mediante RLS. La base de datos es la capa de autorización definitiva.

## Capacidades

- Sesión persistente y login con Supabase Auth.
- Panel de dueño: mascotas, historial clínico, calendario y adopciones.
- Panel veterinario: CRM, staff, fichas clínicas y alertas.
- Panel administrativo: usuarios, clínicas, planes y moderación.
- Manejo visible de errores de carga y escritura.
