import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { useStore } from '../store';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const login = useStore(s => s.login);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true); setError(null);
    try {
      await login(email, password);
      const role = useStore.getState().currentUser?.role;
      navigate(`/${role?.toLowerCase()}`, { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No fue posible iniciar sesión.');
    } finally { setSubmitting(false); }
  };

  return <div className="login-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f5' }}>
    <form onSubmit={handleLogin} style={{ background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '340px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#18181b', fontWeight: 'bold', fontSize: '20px' }}><PawPrint color="#0ea5e9" /> PETCARE PRO</div>
      <p style={{ color: '#71717a', marginBottom: '24px', fontSize: '14px' }}>Inicia sesión en tu cuenta para continuar.</p>
      {error && <p role="alert" style={{ color: '#b91c1c', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
      <label style={{ display: 'block', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>Correo electrónico<input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '8px', border: '1px solid #e4e4e7' }} required autoComplete="email" placeholder="ejemplo@mail.com" /></label>
      <label style={{ display: 'block', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>Contraseña<input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '8px', border: '1px solid #e4e4e7' }} required autoComplete="current-password" /></label>
      <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? .7 : 1 }}>{submitting ? 'Ingresando…' : 'Ingresar'}</button>
    </form>
  </div>;
}
