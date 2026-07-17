import { create } from 'zustand';
import { User, Clinic, Pet, Alert, AdoptionPost, Appointment, Role, MedicalRecord, StaffDoctor } from './types';
import { supabase } from './lib/supabase';

interface AppState {
  // Estado de Autenticación
  currentUser: User | null;
  users: User[];
  login: (email: string) => boolean;
  logout: () => void;

  // Estado de Datos
  clinics: Clinic[];
  pets: Pet[];
  alerts: Alert[];
  adoptions: AdoptionPost[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  staffDoctors: StaffDoctor[];

  // Estado de Carga
  isLoading: boolean;
  
  // Acciones (Asíncronas)
  fetchData: () => Promise<void>;
  
  // CRUD Usuarios (Admin)
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUserRole: (id: string, role: Role) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // CRUD Clínicas (Admin)
  addClinic: (clinic: Omit<Clinic, 'id'>) => Promise<void>;
  updateClinicSubscription: (id: string, sub: 'FREE' | 'PRO' | 'PREMIUM') => Promise<void>;
  deleteClinic: (id: string) => Promise<void>;

  // CRUD Médicos (Clínica)
  addDoctor: (doctor: Omit<StaffDoctor, 'id'>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;

  // CRUD Fichas Clínicas (Clínica)
  addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'date'>) => Promise<void>;

  // Moderación
  deleteAdoption: (id: string) => Promise<void>;

  addAlert: (alert: Omit<Alert, 'id' | 'date'>) => Promise<void>;
  markAlertRead: (id: string) => Promise<void>;
  addAdoption: (post: Omit<AdoptionPost, 'id' | 'datePosted' | 'status'>) => Promise<void>;
  addPet: (pet: Omit<Pet, 'id'>) => Promise<void>;
  addAppointment: (app: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [],
  clinics: [],
  pets: [],
  alerts: [],
  adoptions: [],
  appointments: [],
  medicalRecords: [],
  staffDoctors: [],
  isLoading: true,

  fetchData: async () => {
    try {
      const [
        { data: users },
        { data: clinics },
        { data: pets },
        { data: alerts },
        { data: adoptions },
        { data: appointments },
        { data: medicalRecords },
        { data: staffDoctors }
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('clinics').select('*'),
        supabase.from('pets').select('*'),
        supabase.from('alerts').select('*'),
        supabase.from('adoptions').select('*'),
        supabase.from('appointments').select('*'),
        supabase.from('medical_records').select('*'),
        supabase.from('staff_doctors').select('*')
      ]);

      // Mapear snake_case (BD) a camelCase (Frontend)
      set({
        users: users || [],
        clinics: clinics?.map(c => ({...c, ownerId: c.owner_id})) || [],
        pets: pets?.map(p => ({...p, ownerId: p.owner_id})) || [],
        alerts: alerts?.map(a => ({...a, senderId: a.sender_id, receiverId: a.receiver_id})) || [],
        adoptions: adoptions?.map(a => ({...a, creatorId: a.creator_id, petName: a.pet_name, contactPhone: a.contact_phone, datePosted: a.date_posted})) || [],
        appointments: appointments?.map(a => ({...a, petId: a.pet_id, clinicId: a.clinic_id, ownerId: a.owner_id})) || [],
        medicalRecords: medicalRecords?.map(m => ({...m, petId: m.pet_id, clinicId: m.clinic_id, doctorName: m.doctor_name, recordType: m.record_type})) || [],
        staffDoctors: staffDoctors?.map(d => ({...d, clinicId: d.clinic_id})) || [],
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      set({ isLoading: false });
    }
  },

  login: (email: string) => {
    const user = get().users.find(u => u.email === email);
    if (user) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  logout: () => set({ currentUser: null }),

  addAlert: async (alert) => {
    const { data, error } = await supabase.from('alerts').insert({
      sender_id: alert.senderId,
      receiver_id: alert.receiverId,
      title: alert.title,
      message: alert.message
    }).select().single();

    if (!error && data) {
      const mapped = { ...data, senderId: data.sender_id, receiverId: data.receiver_id };
      set(state => ({ alerts: [...state.alerts, mapped] }));
    }
  },

  markAlertRead: async (id) => {
    const { error } = await supabase.from('alerts').update({ read: true }).eq('id', id);
    if (!error) {
      set(state => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a)
      }));
    }
  },

  addAdoption: async (post) => {
    const { data, error } = await supabase.from('adoptions').insert({
      creator_id: post.creatorId,
      pet_name: post.petName,
      species: post.species,
      age: post.age,
      description: post.description,
      contact_phone: post.contactPhone
    }).select().single();

    if (!error && data) {
      const mapped = { ...data, creatorId: data.creator_id, petName: data.pet_name, contactPhone: data.contact_phone, datePosted: data.date_posted };
      set(state => ({ adoptions: [...state.adoptions, mapped] }));
    }
  },

  addPet: async (pet) => {
    const { data, error } = await supabase.from('pets').insert({
      owner_id: pet.ownerId,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      sex: pet.sex,
      birth: pet.birth,
      weight: pet.weight,
      color: pet.color,
      allergies: pet.allergies
    }).select().single();

    if (!error && data) {
      const mapped = { ...data, ownerId: data.owner_id };
      set(state => ({ pets: [...state.pets, mapped] }));
    }
  },

  addAppointment: async (app) => {
    const { data: newApp, error } = await supabase.from('appointments').insert({
      pet_id: app.petId,
      clinic_id: app.clinicId,
      owner_id: app.ownerId,
      service: app.service,
      date: app.date,
      status: 'Confirmada'
    }).select().single();

    if (!error && newApp) {
      const mappedApp = { ...newApp, petId: newApp.pet_id, clinicId: newApp.clinic_id, ownerId: newApp.owner_id };
      
      // Crear alerta automática
      const { data: newAlert } = await supabase.from('alerts').insert({
        sender_id: app.clinicId,
        receiver_id: app.ownerId,
        title: 'Nueva visita agendada',
        message: `Tienes una nueva visita programada para el servicio: ${app.service} en la fecha ${new Date(app.date).toLocaleString()}.`
      }).select().single();

      set(state => ({ 
        appointments: [...state.appointments, mappedApp],
        alerts: newAlert ? [...state.alerts, { ...newAlert, senderId: newAlert.sender_id, receiverId: newAlert.receiver_id }] : state.alerts
      }));
    }
  },

  addUser: async (user) => {
    const { data, error } = await supabase.from('users').insert(user).select().single();
    if (!error && data) set(state => ({ users: [...state.users, data] }));
  },
  updateUserRole: async (id, role) => {
    const { error } = await supabase.from('users').update({ role }).eq('id', id);
    if (!error) set(state => ({ users: state.users.map(u => u.id === id ? { ...u, role } : u) }));
  },
  deleteUser: async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (!error) set(state => ({ users: state.users.filter(u => u.id !== id) }));
  },

  addClinic: async (clinic) => {
    const payload = { owner_id: clinic.ownerId, name: clinic.name, address: clinic.address, phone: clinic.phone, subscription: clinic.subscription, services: clinic.services };
    const { data, error } = await supabase.from('clinics').insert(payload).select().single();
    if (!error && data) set(state => ({ clinics: [...state.clinics, { ...data, ownerId: data.owner_id }] }));
  },
  updateClinicSubscription: async (id, sub) => {
    const { error } = await supabase.from('clinics').update({ subscription: sub }).eq('id', id);
    if (!error) set(state => ({ clinics: state.clinics.map(c => c.id === id ? { ...c, subscription: sub } : c) }));
  },
  deleteClinic: async (id) => {
    const { error } = await supabase.from('clinics').delete().eq('id', id);
    if (!error) set(state => ({ clinics: state.clinics.filter(c => c.id !== id) }));
  },

  addDoctor: async (doc) => {
    const payload = { clinic_id: doc.clinicId, name: doc.name, specialty: doc.specialty, phone: doc.phone };
    const { data, error } = await supabase.from('staff_doctors').insert(payload).select().single();
    if (!error && data) set(state => ({ staffDoctors: [...state.staffDoctors, { ...data, clinicId: data.clinic_id }] }));
  },
  deleteDoctor: async (id) => {
    const { error } = await supabase.from('staff_doctors').delete().eq('id', id);
    if (!error) set(state => ({ staffDoctors: state.staffDoctors.filter(d => d.id !== id) }));
  },

  addMedicalRecord: async (rec) => {
    const payload = { pet_id: rec.petId, clinic_id: rec.clinicId, doctor_name: rec.doctorName, record_type: rec.recordType, diagnosis: rec.diagnosis, treatment: rec.treatment, notes: rec.notes };
    const { data, error } = await supabase.from('medical_records').insert(payload).select().single();
    if (!error && data) {
      set(state => ({ medicalRecords: [...state.medicalRecords, { ...data, petId: data.pet_id, clinicId: data.clinic_id, doctorName: data.doctor_name, recordType: data.record_type }] }));
    }
  },

  deleteAdoption: async (id) => {
    const { error } = await supabase.from('adoptions').delete().eq('id', id);
    if (!error) set(state => ({ adoptions: state.adoptions.filter(a => a.id !== id) }));
  }
}));
