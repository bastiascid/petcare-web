import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Settings, ChevronRight, BarChart3, Building2, Users, ShieldAlert, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../store';
import { Role } from '../../types';

export function AdminLayout() {
  const { currentUser, logout, clinics, users, adoptions, addClinic, updateClinicSubscription, deleteClinic, addUser, updateUserRole, deleteUser, deleteAdoption } = useStore();
  const navigate = useNavigate();
  const [section, setSection] = useState('Dashboard General');
  
  // Modals state
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [clinicForm, setClinicForm] = useState({ name: '', ownerId: '', phone: '', address: '', subscription: 'FREE', services: [] });
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'OWNER' as Role });

  const nav = [
    { label: 'Dashboard General', icon: BarChart3 },
    { label: 'Gestión de Clínicas', icon: Building2 },
    { label: 'Gestión de Usuarios', icon: Users },
    { label: 'Moderación', icon: ShieldAlert }
  ];

  const totalIngresos = clinics.filter(c => c.subscription === 'PREMIUM').length * 29.99 + clinics.filter(c => c.subscription === 'PRO').length * 19.99;

  const handleAddClinic = (e: React.FormEvent) => {
    e.preventDefault();
    addClinic({ ...clinicForm, subscription: clinicForm.subscription as any });
    setShowClinicModal(false);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(userForm);
    setShowUserModal(false);
  };

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
                  <div><strong>${totalIngresos.toFixed(2)}</strong><p>Ingresos Mensuales Estimados (MRR)</p></div>
                </div>
                <div className="metric">
                  <div><strong>{clinics.length}</strong><p>Clínicas Activas</p></div>
                </div>
                <div className="metric">
                  <div><strong>{users.length}</strong><p>Usuarios Registrados</p></div>
                </div>
              </div>
            </div>
          )}

          {section === 'Gestión de Clínicas' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Directorio Comercial</h3>
                <button className="submit" style={{ padding: '8px 16px', width: 'auto' }} onClick={() => setShowClinicModal(true)}><Plus size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Nueva Clínica</button>
              </div>
              <table style={{ width: '100%', textAlign: 'left', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '10px 0' }}>Nombre</th>
                    <th>ID Dueño</th>
                    <th>Plan</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clinics.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                      <td style={{ padding: '12px 0' }}><b>{c.name}</b><br/><small style={{color:'#777'}}>{c.phone}</small></td>
                      <td style={{ fontSize: '13px', color: '#555' }}>{c.ownerId.slice(0,8)}...</td>
                      <td>
                        <select 
                          value={c.subscription} 
                          onChange={(e) => updateClinicSubscription(c.id, e.target.value as any)}
                          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                        >
                          <option value="FREE">FREE</option>
                          <option value="PRO">PRO</option>
                          <option value="PREMIUM">PREMIUM</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => {if(confirm('¿Eliminar clínica?')) deleteClinic(c.id)}} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {section === 'Gestión de Usuarios' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Usuarios de la Plataforma</h3>
                <button className="submit" style={{ padding: '8px 16px', width: 'auto' }} onClick={() => setShowUserModal(true)}><Plus size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Nuevo Usuario</button>
              </div>
              <table style={{ width: '100%', textAlign: 'left', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '10px 0' }}>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                      <td style={{ padding: '12px 0' }}><b>{u.name}</b></td>
                      <td style={{ fontSize: '13px', color: '#555' }}>{u.email}</td>
                      <td>
                        <select 
                          value={u.role} 
                          onChange={(e) => updateUserRole(u.id, e.target.value as Role)}
                          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                          disabled={u.id === currentUser?.id}
                        >
                          <option value="OWNER">DUEÑO</option>
                          <option value="VET">VETERINARIO</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td>
                        <button disabled={u.id === currentUser?.id} onClick={() => {if(confirm('¿Eliminar usuario?')) deleteUser(u.id)}} style={{ background: 'transparent', border: 'none', color: u.id === currentUser?.id ? '#ccc' : '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {section === 'Moderación' && (
            <div className="card">
              <h3>Moderación de Adopciones</h3>
              <div className="grid" style={{ marginTop: '20px' }}>
                {adoptions.map(a => (
                  <div className="card" key={a.id} style={{ border: '1px solid #e4e4e7', boxShadow: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <b>{a.petName}</b>
                      <button onClick={() => {if(confirm('¿Borrar publicación?')) deleteAdoption(a.id)}} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <p style={{ margin: '10px 0', fontSize: '14px', color: '#555' }}>{a.description}</p>
                    <small>Contacto: {a.contactPhone}</small>
                  </div>
                ))}
                {adoptions.length === 0 && <p style={{ color: '#777' }}>No hay publicaciones activas.</p>}
              </div>
            </div>
          )}

        </div>
        <footer style={{ marginTop: 'auto', padding: '20px', textAlign: 'center', fontSize: '13px', color: '#71717a' }}>
          Desarrollado por <a href="https://bastiascid.cl" target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 'bold' }}>Cristian Bastias</a>
        </footer>
      </main>

      {/* Modals */}
      {showClinicModal && (
        <div className="overlay">
          <section className="modal">
            <button className="close" onClick={() => setShowClinicModal(false)}>×</button>
            <h2>Nueva Clínica</h2>
            <form onSubmit={handleAddClinic}>
              <label>Nombre Clínica <input required value={clinicForm.name} onChange={e => setClinicForm({...clinicForm, name: e.target.value})} /></label>
              <label>ID del Dueño (Usuario) <input required value={clinicForm.ownerId} onChange={e => setClinicForm({...clinicForm, ownerId: e.target.value})} /></label>
              <label>Teléfono <input required value={clinicForm.phone} onChange={e => setClinicForm({...clinicForm, phone: e.target.value})} /></label>
              <label>Plan Inicial 
                <select value={clinicForm.subscription} onChange={e => setClinicForm({...clinicForm, subscription: e.target.value})}>
                  <option value="FREE">FREE</option>
                  <option value="PRO">PRO</option>
                  <option value="PREMIUM">PREMIUM</option>
                </select>
              </label>
              <button className="submit" style={{ marginTop: '15px' }}>Crear Clínica</button>
            </form>
          </section>
        </div>
      )}

      {showUserModal && (
        <div className="overlay">
          <section className="modal">
            <button className="close" onClick={() => setShowUserModal(false)}>×</button>
            <h2>Nuevo Usuario</h2>
            <form onSubmit={handleAddUser}>
              <label>Nombre Completo <input required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} /></label>
              <label>Correo Electrónico <input type="email" required value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} /></label>
              <label>Rol 
                <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as Role})}>
                  <option value="OWNER">DUEÑO DE MASCOTA</option>
                  <option value="VET">VETERINARIO / CLÍNICA</option>
                  <option value="ADMIN">ADMINISTRADOR</option>
                </select>
              </label>
              <button className="submit" style={{ marginTop: '15px' }}>Crear Usuario</button>
            </form>
          </section>
        </div>
      )}

    </div>
  );
}
