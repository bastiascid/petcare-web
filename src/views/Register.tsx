import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint, ArrowLeft } from 'lucide-react';
import { useStore } from '../store';
import type { Role } from '../types';

export function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('OWNER');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const register = useStore(s => s.register);
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true); setError(null);
    try {
      await register(email, password, fullName, role);
      // Depending on email confirmation settings, they might be logged in or not.
      const userRole = useStore.getState().currentUser?.role;
      if (userRole) {
        navigate(`/${userRole.toLowerCase()}`, { replace: true });
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No fue posible registrar la cuenta.');
    } finally { setSubmitting(false); }
  };

  return <div className="login-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'url("/landing-bg.png") center/cover no-repeat', position: 'relative', padding: '1rem' }}>
    <Link to="/" style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
      <ArrowLeft size={20} /> Volver al Inicio
    </Link>
    <form onSubmit={handleRegister} style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', width: '100%', maxWidth: '340px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#18181b', fontWeight: 'bold', fontSize: '20px' }}><PawPrint color="#0ea5e9" /> CREAR CUENTA</div>
      <p style={{ color: '#71717a', marginBottom: '20px', fontSize: '14px' }}>Únete a la red PetCare Pro</p>
      
      {error && <p role="alert" style={{ color: '#b91c1c', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
      
      <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>Nombre Completo
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '8px', border: '1px solid #e4e4e7' }} required placeholder="Ej. Juan Pérez" />
      </label>
      
      <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>Correo electrónico
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '8px', border: '1px solid #e4e4e7' }} required autoComplete="email" placeholder="ejemplo@mail.com" />
      </label>
      
      <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>Contraseña
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '8px', border: '1px solid #e4e4e7' }} required autoComplete="new-password" />
      </label>
      
      <label style={{ display: 'block', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>Tipo de Cuenta
        <select value={role} onChange={e => setRole(e.target.value as Role)} style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '8px', border: '1px solid #e4e4e7', background: '#fff' }}>
          <option value="OWNER">Dueño de Mascota</option>
          <option value="VET">Clínica / Veterinario</option>
        </select>
      </label>
      
      <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? .7 : 1 }}>
        {submitting ? 'Registrando...' : 'Registrarse'}
      </button>
      
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#71717a' }}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 'bold' }}>Inicia Sesión</Link>
      </div>
    </form>
  </div>;
}
