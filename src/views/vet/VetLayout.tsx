import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Settings, ChevronRight, Stethoscope, Users, Building, Send, Plus, ClipboardList } from 'lucide-react';
import { useStore } from '../../store';

export function VetLayout() {
  const { currentUser, logout, clinics, pets, users, addUser, addPet, staffDoctors, addDoctor, deleteDoctor, medicalRecords, addMedicalRecord } = useStore();
  const navigate = useNavigate();
  const [section, setSection] = useState('Panel de Clínica');
  
  const clinic = clinics.find(c => c.ownerId === currentUser?.id);
  const myPatients = pets; // En un SaaS real se filtra por clínica o vinculación
  const myStaff = staffDoctors.filter(s => s.clinicId === clinic?.id);
  const myRecords = medicalRecords.filter(m => m.clinicId === clinic?.id);

  // Modals
  const [showClientModal, setShowClientModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  const [clientForm, setClientForm] = useState({ name: '', email: '', role: 'OWNER' as any });
  const [staffForm, setStaffForm] = useState({ name: '', specialty: '', phone: '' });
  const [recordForm, setRecordForm] = useState({ doctorName: '', recordType: 'Control', diagnosis: '', treatment: '', notes: '' });

  const nav = [
    { label: 'Panel de Clínica', icon: Building },
    { label: 'Mis Pacientes (CRM)', icon: Users },
    { label: 'Staff Médico', icon: Stethoscope },
    { label: 'Fichas Clínicas', icon: ClipboardList },
    { label: 'Enviar Alertas', icon: Send }
  ];

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(clientForm);
    alert('Cliente creado exitosamente. Ahora puedes registrar a su mascota usando su ID de usuario.');
    setShowClientModal(false);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if(clinic) addDoctor({ ...staffForm, clinicId: clinic.id });
    setShowStaffModal(false);
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if(clinic && selectedPet) {
      addMedicalRecord({ ...recordForm, clinicId: clinic.id, petId: selectedPet });
      setShowRecordModal(false);
    }
  };

  return (
    <div className="app">
      <aside>
        <div className="brand"><PawPrint/> <span>VET<span>PORTAL</span></span></div>
        <p className="workspace">CLÍNICA AFILIADA</p>
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

          {section === 'Mis Pacientes (CRM)' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Base de Datos de Pacientes</h3>
                <button className="submit" style={{ padding: '8px 16px', width: 'auto' }} onClick={() => setShowClientModal(true)}><Plus size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Nuevo Cliente (Dueño)</button>
              </div>
              <div className="grid">
                {myPatients.map(p => {
                  const owner = users.find(u => u.id === p.ownerId);
                  return (
                    <div className="card" key={p.id}>
                      <b>{p.name}</b> <span>({p.species})</span>
                      <p style={{ margin: '8px 0', fontSize: '14px' }}>Dueño: {owner?.name || p.ownerId}</p>
                      <button className="link" onClick={() => { setSelectedPet(p.id); setShowRecordModal(true); }}>+ Crear Ficha Médica</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {section === 'Staff Médico' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Equipo Veterinario</h3>
                <button className="submit" style={{ padding: '8px 16px', width: 'auto' }} onClick={() => setShowStaffModal(true)}><Plus size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Agregar Médico</button>
              </div>
              <div className="grid">
                {myStaff.map(s => (
                  <div className="card" key={s.id}>
                    <b>Dr/a. {s.name}</b>
                    <p style={{ margin: '8px 0', fontSize: '14px', color: '#555' }}>Especialidad: {s.specialty || 'General'}</p>
                    <button className="link" style={{ color: '#ef4444' }} onClick={() => {if(confirm('¿Remover médico?')) deleteDoctor(s.id)}}>Remover</button>
                  </div>
                ))}
                {myStaff.length === 0 && <p style={{ color: '#777' }}>No has agregado médicos a tu staff.</p>}
              </div>
            </div>
          )}

          {section === 'Fichas Clínicas' && (
            <div className="card">
              <h3>Historial de Atenciones (Clínica)</h3>
              <table style={{ width: '100%', textAlign: 'left', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '10px 0' }}>Fecha</th>
                    <th>Paciente</th>
                    <th>Tipo</th>
                    <th>Médico</th>
                  </tr>
                </thead>
                <tbody>
                  {myRecords.map(r => {
                    const pet = pets.find(p => p.id === r.petId);
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                        <td style={{ padding: '12px 0' }}>{new Date(r.date).toLocaleDateString()}</td>
                        <td><b>{pet?.name}</b></td>
                        <td><span className="status confirmada">{r.recordType}</span></td>
                        <td>{r.doctorName}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {section === 'Enviar Alertas' && (
            <SendAlerts clinicId={clinic?.id || ''} patients={myPatients} />
          )}

        </div>
        <footer style={{ marginTop: 'auto', padding: '20px', textAlign: 'center', fontSize: '13px', color: '#71717a' }}>
          Desarrollado por <a href="https://bastiascid.cl" target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 'bold' }}>Cristian Bastias</a>
        </footer>
      </main>

      {showClientModal && (
        <div className="overlay">
          <section className="modal">
            <button className="close" onClick={() => setShowClientModal(false)}>×</button>
            <h2>Registrar Nuevo Cliente</h2>
            <form onSubmit={handleAddClient}>
              <label>Nombre Completo <input required value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} /></label>
              <label>Correo Electrónico <input type="email" required value={clientForm.email} onChange={e => setClientForm({...clientForm, email: e.target.value})} /></label>
              <button className="submit" style={{ marginTop: '15px' }}>Crear Cliente</button>
            </form>
          </section>
        </div>
      )}

      {showStaffModal && (
        <div className="overlay">
          <section className="modal">
            <button className="close" onClick={() => setShowStaffModal(false)}>×</button>
            <h2>Agregar Médico al Staff</h2>
            <form onSubmit={handleAddStaff}>
              <label>Nombre del Médico <input required value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} /></label>
              <label>Especialidad <input value={staffForm.specialty} onChange={e => setStaffForm({...staffForm, specialty: e.target.value})} placeholder="Ej: Traumatología" /></label>
              <label>Teléfono <input value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})} /></label>
              <button className="submit" style={{ marginTop: '15px' }}>Agregar Médico</button>
            </form>
          </section>
        </div>
      )}

      {showRecordModal && (
        <div className="overlay">
          <section className="modal">
            <button className="close" onClick={() => setShowRecordModal(false)}>×</button>
            <h2>Crear Ficha Clínica</h2>
            <form onSubmit={handleAddRecord}>
              <label>Médico Tratante 
                <select required value={recordForm.doctorName} onChange={e => setRecordForm({...recordForm, doctorName: e.target.value})}>
                  <option value="">Seleccione...</option>
                  {myStaff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </label>
              <label>Tipo de Atención
                <select required value={recordForm.recordType} onChange={e => setRecordForm({...recordForm, recordType: e.target.value})}>
                  <option value="Control">Control General</option>
                  <option value="Vacuna">Vacunación</option>
                  <option value="Urgencia">Urgencia</option>
                  <option value="Cirugía">Cirugía</option>
                </select>
              </label>
              <label>Diagnóstico <input required value={recordForm.diagnosis} onChange={e => setRecordForm({...recordForm, diagnosis: e.target.value})} /></label>
              <label>Tratamiento <input value={recordForm.treatment} onChange={e => setRecordForm({...recordForm, treatment: e.target.value})} /></label>
              <label>Notas Adicionales <textarea rows={3} value={recordForm.notes} onChange={e => setRecordForm({...recordForm, notes: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e4e4e7' }} /></label>
              <button className="submit" style={{ marginTop: '15px' }}>Guardar Ficha Médica</button>
            </form>
          </section>
        </div>
      )}

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
            {patients.map(p => <option key={p.id} value={p.ownerId}>{p.name} (Dueño: {p.ownerId.slice(0,6)}...)</option>)}
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
