import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Settings, ChevronRight, Stethoscope, Users, Building, Send } from 'lucide-react';
import { useStore } from '../../store';

export function VetLayout() {
  const { currentUser, logout, clinics, pets, addAlert } = useStore();
  const navigate = useNavigate();
  const [section, setSection] = useState('Panel de Clínica');
  
  const clinic = clinics.find(c => c.ownerId === currentUser?.id);
  const myPatients = pets; // En un caso real filtraríamos por clínica

  const nav = [
    { label: 'Panel de Clínica', icon: Building },
    { label: 'Mis Pacientes', icon: Users },
    { label: 'Agendar Visita', icon: Stethoscope },
    { label: 'Enviar Alertas', icon: Send }
  ];

  const handleNav = (label: string) => {
    setSection(label);
  };

  return (
    <div className="app">
      <aside>
        <div className="brand"><PawPrint/> <span>VET<span>PORTAL</span></span></div>
        <p className="workspace">CLÍNICA AFILIADA</p>
        {nav.map(({label, icon: Icon}) => (
          <button 
            className={section === label ? 'nav active' : 'nav'} 
            onClick={() => handleNav(label)} 
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
            <p className="eyebrow">ROL: VETERINARIO / CLÍNICA</p>
            <h1>{section}</h1>
          </div>
        </header>
        <div className="content-narrow">
          {section === 'Panel de Clínica' && (
            <div>
              <h2>{clinic?.name}</h2>
              <p>Suscripción actual: <b style={{ color: clinic?.subscription === 'PREMIUM' ? '#0ea5e9' : '#000' }}>{clinic?.subscription}</b></p>
              <button className="submit" style={{ marginTop: '20px' }}>Actualizar Perfil de Directorio</button>
            </div>
          )}
          {section === 'Mis Pacientes' && (
            <div className="grid">
              {myPatients.map(p => (
                <div className="card" key={p.id}>
                  <b>{p.name}</b> <span>({p.species})</span>
                  <p>Dueño ID: {p.ownerId}</p>
                </div>
              ))}
            </div>
          )}
          {section === 'Enviar Alertas' && (
            <SendAlerts clinicId={clinic?.id || ''} patients={myPatients} />
          )}
          {section === 'Agendar Visita' && (
            <ScheduleVisit clinicId={clinic?.id || ''} patients={myPatients} />
          )}
        </div>
        <footer style={{ marginTop: 'auto', padding: '20px', textAlign: 'center', fontSize: '13px', color: '#71717a' }}>
          Desarrollado por <a href="https://bastiascid.cl" target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 'bold' }}>Cristian Bastias</a>
        </footer>
      </main>
    </div>
  );
}

function ScheduleVisit({ clinicId, patients }: { clinicId: string; patients: any[] }) {
  const { addAppointment } = useStore();
  const [form, setForm] = useState({ petId: '', ownerId: '', service: '', date: '' });

  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    const patient = patients.find(p => p.id === pId);
    if(patient) {
      setForm({ ...form, petId: pId, ownerId: patient.ownerId });
    } else {
      setForm({ ...form, petId: '', ownerId: '' });
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({ petId: form.petId, clinicId, ownerId: form.ownerId, service: form.service, date: form.date });
    alert('Visita agendada. Se ha enviado una alerta automática al dueño.');
    setForm({ petId: '', ownerId: '', service: '', date: '' });
  };

  return (
    <div className="card">
      <h3>Programar nueva atención</h3>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '15px' }}>El sistema notificará automáticamente al dueño de la mascota.</p>
      <form onSubmit={submit}>
        <label>Paciente
          <select value={form.petId} onChange={handlePatientSelect} required>
            <option value="">Seleccione un paciente...</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name} (Dueño: {p.ownerId})</option>)}
          </select>
        </label>
        <label>Servicio
          <input required value={form.service} onChange={e => setForm({...form, service: e.target.value})} placeholder="Ej: Control general, Vacunación..." />
        </label>
        <label>Fecha y Hora
          <input type="datetime-local" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
        </label>
        <button className="submit" style={{ marginTop: '10px' }}>Agendar Visita</button>
      </form>
    </div>
  );
}

function SendAlerts({ clinicId, patients }: { clinicId: string; patients: any[] }) {
  const { addAlert } = useStore();
  const [form, setForm] = useState({ receiverId: '', title: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert({ ...form, senderId: clinicId, read: false });
    alert('Alerta enviada exitosamente');
    setForm({ receiverId: '', title: '', message: '' });
  };

  return (
    <div className="card">
      <h3>Notificar a un paciente</h3>
      <form onSubmit={submit}>
        <label>Paciente / Dueño
          <select value={form.receiverId} onChange={e => setForm({...form, receiverId: e.target.value})} required>
            <option value="">Seleccione...</option>
            {patients.map(p => <option key={p.id} value={p.ownerId}>{p.name} (Dueño: {p.ownerId})</option>)}
          </select>
        </label>
        <label>Título de la alerta
          <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        </label>
        <label>Mensaje
          <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e4e4e7' }} rows={4} />
        </label>
        <button className="submit" style={{ marginTop: '10px' }}>Enviar Alerta</button>
      </form>
    </div>
  );
}
