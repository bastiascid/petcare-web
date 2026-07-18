import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization) throw new Error('No autorizado.');
    const url = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const caller = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: { user: callerUser }, error: callerError } = await caller.auth.getUser();
    if (callerError || !callerUser) throw new Error('No autorizado.');
    const { data: profile, error: profileError } = await caller.from('users').select('role').eq('id', callerUser.id).single();
    if (profileError || !['ADMIN', 'VET'].includes(profile.role)) throw new Error('Permisos insuficientes.');
    const { name, email, role = 'OWNER' } = await request.json();
    if (!name || !email || !['OWNER', 'VET', 'ADMIN'].includes(role)) throw new Error('Datos de invitación inválidos.');
    if (profile.role === 'VET' && role !== 'OWNER') throw new Error('Una clínica solo puede invitar dueños.');
    const admin = createClient(url, serviceKey);
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { data: { name, role } });
    if (error || !data.user) throw new Error(error?.message || 'No se pudo enviar la invitación.');
    const { error: roleError } = await admin.from('users').update({ role, name }).eq('id', data.user.id);
    if (roleError) throw new Error(roleError.message);
    return Response.json({ id: data.user.id, name, email, role }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Error inesperado.' }, { status: 400, headers: corsHeaders });
  }
});
