import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  return <div className="login-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'url("/login-bg.png") center/cover no-repeat', position: 'relative', padding: '1rem' }}>
    <Link to="/" style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
      <ArrowLeft size={20} /> Volver al Inicio
    </Link>
    <form onSubmit={handleLogin} style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', width: '100%', maxWidth: '340px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#18181b', fontWeight: 'bold', fontSize: '20px' }}><PawPrint color="#0ea5e9" /> PETCARE PRO</div>
      <p style={{ color: '#71717a', marginBottom: '24px', fontSize: '14px' }}>Inicia sesión en tu cuenta para continuar.</p>
      {error && <p role="alert" style={{ color: '#b91c1c', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
      <label style={{ display: 'block', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>Correo electrónico<input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '8px', border: '1px solid #e4e4e7', boxSizing: 'border-box' }} required autoComplete="email" placeholder="ejemplo@mail.com" /></label>
      <label style={{ display: 'block', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>Contraseña
        <div style={{ position: 'relative', marginTop: '6px' }}>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', paddingRight: '40px', borderRadius: '8px', border: '1px solid #e4e4e7', boxSizing: 'border-box' }} required autoComplete="current-password" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', padding: 0, display: 'flex', alignItems: 'center' }}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>
      <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? .7 : 1 }}>{submitting ? 'Ingresando…' : 'Ingresar'}</button>
      
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#71717a' }}>
        ¿No tienes cuenta?{' '}
        <Link to="/register" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 'bold' }}>Regístrate aquí</Link>
      </div>
    </form>
  </div>;
}
