import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Settings, ChevronRight, BarChart3, Building2 } from 'lucide-react';
import { useStore } from '../../store';

export function AdminLayout() {
  const { currentUser, logout, clinics, users } = useStore();
  const navigate = useNavigate();
  const [section, setSection] = useState('Dashboard General');

  const nav = [
    { label: 'Dashboard General', icon: BarChart3 },
    { label: 'Gestión de Clínicas', icon: Building2 }
  ];

  const totalIngresos = clinics.filter(c => c.subscription === 'PREMIUM').length * 29.99; // Simulación de precio

  return (
    <div className="app">
      <aside>
        <div className="brand"><PawPrint/> <span>PETCARE<span>ADMIN</span></span></div>
        <p className="workspace">PLATAFORMA</p>
        {nav.map(({label, icon: Icon}) => (
          <button 
            className={section === label ? 'nav active' : 'nav'} 
            onClick={() => setSection(label)} 
            key={label}
          >
            <Icon size={19}/>{label}
          </button>
        ))}
        <div className="aside-bottom">
          <button className="profile" onClick={() => { logout(); navigate('/login'); }}>
            <span>{currentUser?.name.slice(0, 2).toUpperCase()}</span>
            <b>{currentUser?.name}<small>Cerrar sesión</small></b>
            <ChevronRight size={16}/>
          </button>
        </div>
      </aside>
      <main>
        <header>
          <div>
            <p className="eyebrow">ROL: ADMINISTRADOR GLOBAL</p>
            <h1>{section}</h1>
          </div>
        </header>
        <div className="content-narrow">
          {section === 'Dashboard General' && (
            <div>
              <div className="metrics" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className="metric">
                  <div><strong>${totalIngresos.toFixed(2)}</strong><p>Ingresos Mensuales Recurrentes (MRR)</p></div>
                </div>
                <div className="metric">
                  <div><strong>{clinics.length}</strong><p>Clínicas Activas</p></div>
                </div>
                <div className="metric">
                  <div><strong>{users.filter(u => u.role === 'OWNER').length}</strong><p>Usuarios Registrados</p></div>
                </div>
              </div>
            </div>
          )}
          {section === 'Gestión de Clínicas' && (
            <div className="card">
              <h3>Directorio Comercial</h3>
              <table style={{ width: '100%', textAlign: 'left', marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Plan</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clinics.map(c => (
                    <tr key={c.id}>
                      <td style={{ padding: '10px 0' }}><b>{c.name}</b></td>
                      <td><span className={`status ${c.subscription === 'PREMIUM' ? 'confirmada' : ''}`}>{c.subscription}</span></td>
                      <td>{c.phone}</td>
                      <td><button className="link">Gestionar Suscripción</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <footer style={{ marginTop: 'auto', padding: '20px', textAlign: 'center', fontSize: '13px', color: '#71717a' }}>
          Desarrollado por <a href="https://bastiascid.cl" target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 'bold' }}>Cristian Bastias</a>
        </footer>
      </main>
    </div>
  );
}
