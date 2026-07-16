import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { PawPrint } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const login = useStore(s => s.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email)) {
      navigate('/');
    } else {
      setError(true);
    }
  };

  return (
    <div className="login-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f5' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '340px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#18181b', fontWeight: 'bold', fontSize: '20px' }}>
          <PawPrint color="#0ea5e9" /> PETCARE PRO
        </div>
        <p style={{ color: '#71717a', marginBottom: '24px', fontSize: '14px' }}>Inicia sesión en tu cuenta para continuar.</p>
        
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>Usuario no encontrado. Prueba con admin@petcare.com, juan@clinicavet.com o caro@mail.com</p>}
        
        <label style={{ display: 'block', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
          Correo electrónico
          <input 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '8px', border: '1px solid #e4e4e7' }} 
            required
            placeholder="ejemplo@mail.com"
          />
        </label>
        
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Ingresar
        </button>

        <div style={{ marginTop: '24px', fontSize: '12px', color: '#a1a1aa' }}>
          <b>Cuentas de prueba:</b>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li>Dueño: caro@mail.com</li>
            <li>Veterinario: juan@clinicavet.com</li>
            <li>Admin: admin@petcare.com</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
