import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PawPrint, Settings, ChevronRight, House, Heart, MapPin, Bell, CalendarDays, Plus } from 'lucide-react';
import { useStore } from '../../store';

export function OwnerLayout() {
  const { currentUser, logout, alerts } = useStore();
  const navigate = useNavigate();
  const [section, setSection] = useState('Inicio');

  const unreadAlerts = alerts.filter(a => a.receiverId === currentUser?.id && !a.read).length;

  const nav = [
    { label: 'Inicio', icon: House, path: '' },
    { label: 'Mis Mascotas', icon: PawPrint, path: 'pets' },
    { label: 'Calendario', icon: CalendarDays, path: 'calendar' },
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
          <Route path="" element={<div className="content-narrow"><h2>Bienvenido al panel principal</h2><p>Tienes {unreadAlerts} alertas nuevas.</p></div>} />
          <Route path="pets" element={<OwnerPets />} />
          <Route path="calendar" element={<OwnerCalendar />} />
          <Route path="community" element={<CommunityView />} />
          <Route path="directory" element={<div className="content-narrow"><h2>Directorio Médico</h2><p>Clínicas afiliadas y suscripciones destacadas.</p></div>} />
        </Routes>
      </main>
    </div>
  );
}

function OwnerPets() {
  const { pets, currentUser, addPet } = useStore();
  const [showModal, setShowModal] = useState(false);
  const myPets = pets.filter(p => p.ownerId === currentUser?.id);
  const [form, setForm] = useState({ name: '', species: 'Perro', breed: '', sex: 'Macho', birth: '', weight: 0, color: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if(currentUser) {
      addPet({ ...form, ownerId: currentUser.id });
      setShowModal(false);
    }
  };

  return (
    <div className="content-narrow">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Mis Mascotas</h2>
        <button className="add" onClick={() => setShowModal(true)}><Plus size={18}/> Registrar Mascota</button>
      </div>
      <div className="grid">
        {myPets.map(p => (
          <div className="card" key={p.id}>
            <b>{p.name}</b> <span>({p.species})</span>
            <p>Raza: {p.breed} · Peso: {p.weight}kg</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="overlay">
          <section className="modal">
            <button className="close" onClick={() => setShowModal(false)}>×</button>
            <h2>Registrar Mascota</h2>
            <form onSubmit={submit}>
              <label>Nombre <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label>Especie <select value={form.species} onChange={e => setForm({...form, species: e.target.value})}><option>Perro</option><option>Gato</option></select></label>
                <label>Raza <input required value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} /></label>
                <label>Sexo <select value={form.sex} onChange={e => setForm({...form, sex: e.target.value})}><option>Macho</option><option>Hembra</option></select></label>
                <label>Nacimiento <input type="date" required value={form.birth} onChange={e => setForm({...form, birth: e.target.value})} /></label>
                <label>Peso (kg) <input type="number" required value={form.weight} onChange={e => setForm({...form, weight: Number(e.target.value)})} /></label>
                <label>Color <input required value={form.color} onChange={e => setForm({...form, color: e.target.value})} /></label>
              </div>
              <button className="submit" style={{ marginTop: '15px' }}>Guardar mascota</button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function OwnerCalendar() {
  const { appointments, currentUser, clinics, pets } = useStore();
  const myApps = appointments.filter(a => a.ownerId === currentUser?.id);

  return (
    <div className="content-narrow">
      <section className="card calendar">
        <div className="section-head">
          <div><p className="eyebrow">PRÓXIMOS DÍAS</p><h2>Calendario sanitario</h2></div>
        </div>
        <div className="calendar-grid">
          {Array.from({length:31},(_,i)=>{
            const day = i+1;
            const ev = myApps.filter(a => new Date(a.date).getDate() === day);
            return (
              <div className={ev.length ? 'date has-event' : 'date'} key={day}>
                <b>{day}</b>
                {ev.map(x => {
                  const pet = pets.find(p => p.id === x.petId);
                  const clinic = clinics.find(c => c.id === x.clinicId);
                  return <span key={x.id}>{pet?.name}: {x.service} en {clinic?.name}</span>;
                })}
              </div>
            );
          })}
        </div>
      </section>
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
