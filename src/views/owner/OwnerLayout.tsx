import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PawPrint, Settings, ChevronRight, House, Heart, MapPin, Bell } from 'lucide-react';
import { useStore } from '../../store';

export function OwnerLayout() {
  const { currentUser, logout, alerts } = useStore();
  const navigate = useNavigate();
  const [section, setSection] = useState('Inicio');

  const unreadAlerts = alerts.filter(a => a.receiverId === currentUser?.id && !a.read).length;

  const nav = [
    { label: 'Inicio', icon: House, path: '' },
    { label: 'Mis Mascotas', icon: PawPrint, path: 'pets' },
    { label: 'Comunidad & Adopciones', icon: Heart, path: 'community' },
    { label: 'Directorio', icon: MapPin, path: 'directory' }
  ];

  const handleNav = (label: string, path: string) => {
    setSection(label);
    navigate(`/owner/${path}`);
  };

  return (
    <div className="app">
      <aside>
        <div className="brand"><PawPrint/> <span>PET<span>CARE</span></span></div>
        <p className="workspace">MI ESPACIO</p>
        {nav.map(({label, icon: Icon, path}) => (
          <button 
            className={section === label ? 'nav active' : 'nav'} 
            onClick={() => handleNav(label, path)} 
            key={label}
          >
            <Icon size={19}/>{label}
          </button>
        ))}
        <div className="aside-bottom">
          <button className="nav"><Settings size={19}/>Configuración</button>
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
            <p className="eyebrow">ROL: DUEÑO DE MASCOTA</p>
            <h1>{section === 'Inicio' ? `Buenos días, ${currentUser?.name.split(' ')[0]}` : section}</h1>
          </div>
          <div className="header-actions">
            <button className="icon-button" style={{ position: 'relative' }}>
              <Bell size={19}/>
              {unreadAlerts > 0 && <i style={{ position: 'absolute', top: 4, right: 4, background: '#ef4444', width: 8, height: 8, borderRadius: '50%' }}/>}
            </button>
          </div>
        </header>
        <Routes>
          <Route path="" element={<div className="content-narrow"><h2>Bienvenido al panel principal</h2><p>Aquí verás un resumen de las próximas citas y alertas.</p></div>} />
          <Route path="pets" element={<div className="content-narrow"><h2>Mis Mascotas</h2><p>Fichas de tus mascotas</p></div>} />
          <Route path="community" element={<CommunityView />} />
          <Route path="directory" element={<div className="content-narrow"><h2>Directorio Médico</h2><p>Clínicas afiliadas y suscripciones destacadas.</p></div>} />
        </Routes>
      </main>
    </div>
  );
}

function CommunityView() {
  const { adoptions, addAdoption, currentUser } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ petName: '', species: 'Perro', age: '', description: '', contactPhone: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if(currentUser) {
      addAdoption({ ...form, creatorId: currentUser.id });
      setShowModal(false);
    }
  };

  return (
    <div className="content-narrow">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Adopciones y Ayuda</h2>
        <button className="submit" onClick={() => setShowModal(true)}>Publicar Adopción</button>
      </div>
      
      <div className="grid">
        {adoptions.map(a => (
          <div className="card" key={a.id}>
            <b>{a.petName}</b> <span>({a.species}, {a.age})</span>
            <p style={{ margin: '10px 0', fontSize: '14px', color: '#555' }}>{a.description}</p>
            <small style={{ color: '#0ea5e9', fontWeight: 'bold' }}>Contacto: {a.contactPhone}</small>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span className="status confirmada">{a.status}</span>
              <small>{new Date(a.datePosted).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="overlay">
          <section className="modal">
            <button className="close" onClick={() => setShowModal(false)}>×</button>
            <h2>Nueva Publicación</h2>
            <form onSubmit={submit}>
              <label>Nombre mascota <input required value={form.petName} onChange={e => setForm({...form, petName: e.target.value})} /></label>
              <label>Especie <select value={form.species} onChange={e => setForm({...form, species: e.target.value})}><option>Perro</option><option>Gato</option><option>Otro</option></select></label>
              <label>Edad <input required value={form.age} onChange={e => setForm({...form, age: e.target.value})} /></label>
              <label>Descripción <input required value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></label>
              <label>Teléfono contacto <input required value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} /></label>
              <button className="submit">Publicar</button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
