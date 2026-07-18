import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import type { Alert, Appointment, AdoptionPost, Clinic, MedicalRecord, Pet, Role, StaffDoctor, User } from './types';

type DatabaseResult<T> = { data: T | null; error: { message: string } | null };
const requireSuccess = <T>({ data, error }: DatabaseResult<T>, fallback: string): T => {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error(fallback);
  return data;
};
const message = (error: unknown) => error instanceof Error ? error.message : 'No fue posible completar la operación.';
const mapClinic = (c: any): Clinic => ({ ...c, ownerId: c.owner_id });
const mapPet = (p: any): Pet => ({ ...p, ownerId: p.owner_id });
const mapAlert = (a: any): Alert => ({ ...a, senderId: a.sender_id, receiverId: a.receiver_id });
const mapAdoption = (a: any): AdoptionPost => ({ ...a, creatorId: a.creator_id, petName: a.pet_name, contactPhone: a.contact_phone, datePosted: a.date_posted });
const mapAppointment = (a: any): Appointment => ({ ...a, petId: a.pet_id, clinicId: a.clinic_id, ownerId: a.owner_id });
const mapRecord = (m: any): MedicalRecord => ({ ...m, petId: m.pet_id, clinicId: m.clinic_id, doctorName: m.doctor_name, recordType: m.record_type });
const mapDoctor = (d: any): StaffDoctor => ({ ...d, clinicId: d.clinic_id });

interface AppState {
  currentUser: User | null;
  session: Session | null;
  users: User[]; clinics: Clinic[]; pets: Pet[]; alerts: Alert[]; adoptions: AdoptionPost[]; appointments: Appointment[]; medicalRecords: MedicalRecord[]; staffDoctors: StaffDoctor[];
  isLoading: boolean; error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  fetchData: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUserRole: (id: string, role: Role) => Promise<void>; deleteUser: (id: string) => Promise<void>;
  addClinic: (clinic: Omit<Clinic, 'id'>) => Promise<void>; updateClinicSubscription: (id: string, sub: Clinic['subscription']) => Promise<void>; deleteClinic: (id: string) => Promise<void>;
  addDoctor: (doctor: Omit<StaffDoctor, 'id'>) => Promise<void>; deleteDoctor: (id: string) => Promise<void>;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'date'>) => Promise<void>;
  deleteAdoption: (id: string) => Promise<void>; addAlert: (alert: Omit<Alert, 'id' | 'date'>) => Promise<void>; markAlertRead: (id: string) => Promise<void>;
  addAdoption: (post: Omit<AdoptionPost, 'id' | 'datePosted' | 'status'>) => Promise<void>; addPet: (pet: Omit<Pet, 'id'>) => Promise<void>; addAppointment: (app: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null, session: null, users: [], clinics: [], pets: [], alerts: [], adoptions: [], appointments: [], medicalRecords: [], staffDoctors: [], isLoading: true, error: null,
  clearError: () => set({ error: null }),
  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const authResult = await supabase.auth.getSession();
      if (authResult.error) throw new Error(authResult.error.message);
      const session = authResult.data.session;
      if (!session) { set({ currentUser: null, session: null, isLoading: false }); return; }
      const profile = requireSuccess(await supabase.from('users').select('*').eq('auth_id', session.user.id).single(), 'No existe un perfil para esta cuenta.');
      set({ currentUser: profile, session, isLoading: false });
      await get().fetchData();
    } catch (error) { set({ currentUser: null, session: null, isLoading: false, error: message(error) }); }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw new Error(result.error.message);
      const session = result.data.session;
      if (!session) throw new Error('No se recibió una sesión válida.');
      const profile = requireSuccess(await supabase.from('users').select('*').eq('auth_id', session.user.id).single(), 'Esta cuenta no tiene un perfil PETCARE asociado.');
      set({ session, currentUser: profile, isLoading: false });
      await get().fetchData();
    } catch (error) { set({ currentUser: null, session: null, isLoading: false, error: message(error) }); throw error; }
  },
  register: async (email, password, fullName, role) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role }
        }
      });
      if (error) throw new Error(error.message);
      if (!data.session) throw new Error('Por favor revisa tu correo para confirmar tu cuenta.');
      const profile = requireSuccess(await supabase.from('users').select('*').eq('auth_id', data.user!.id).single(), 'Perfil en proceso de creación...');
      set({ session: data.session, currentUser: profile, isLoading: false });
      await get().fetchData();
    } catch (error) { set({ isLoading: false, error: message(error) }); throw error; }
  },
  logout: async () => { const { error } = await supabase.auth.signOut(); if (error) throw new Error(error.message); set({ currentUser: null, session: null, users: [], clinics: [], pets: [], alerts: [], adoptions: [], appointments: [], medicalRecords: [], staffDoctors: [] }); },
  fetchData: async () => {
    if (!get().session) return;
    set({ isLoading: true, error: null });
    try {
      const results = await Promise.all([supabase.from('users').select('*'), supabase.from('clinics').select('*'), supabase.from('pets').select('*'), supabase.from('alerts').select('*'), supabase.from('adoptions').select('*'), supabase.from('appointments').select('*'), supabase.from('medical_records').select('*'), supabase.from('staff_doctors').select('*')]);
      const [users, clinics, pets, alerts, adoptions, appointments, medicalRecords, staffDoctors] = results.map((result, i) => requireSuccess(result, `No fue posible cargar el recurso ${i + 1}.`));
      set({ users, clinics: clinics.map(mapClinic), pets: pets.map(mapPet), alerts: alerts.map(mapAlert), adoptions: adoptions.map(mapAdoption), appointments: appointments.map(mapAppointment), medicalRecords: medicalRecords.map(mapRecord), staffDoctors: staffDoctors.map(mapDoctor), isLoading: false });
    } catch (error) { set({ isLoading: false, error: message(error) }); throw error; }
  },
  addAlert: async alert => { const data = requireSuccess(await supabase.from('alerts').insert({ sender_id: alert.senderId, receiver_id: alert.receiverId, title: alert.title, message: alert.message }).select().single(), 'No se creó la alerta.'); set(s => ({ alerts: [...s.alerts, mapAlert(data)] })); },
  markAlertRead: async id => { requireSuccess(await supabase.from('alerts').update({ read: true }).eq('id', id).select().single(), 'No se actualizó la alerta.'); set(s => ({ alerts: s.alerts.map(a => a.id === id ? { ...a, read: true } : a) })); },
  addAdoption: async post => { const data = requireSuccess(await supabase.from('adoptions').insert({ creator_id: post.creatorId, pet_name: post.petName, species: post.species, age: post.age, description: post.description, contact_phone: post.contactPhone }).select().single(), 'No se creó la publicación.'); set(s => ({ adoptions: [...s.adoptions, mapAdoption(data)] })); },
  addPet: async pet => { const data = requireSuccess(await supabase.from('pets').insert({ owner_id: pet.ownerId, name: pet.name, species: pet.species, breed: pet.breed, sex: pet.sex, birth: pet.birth, weight: pet.weight, color: pet.color, allergies: pet.allergies }).select().single(), 'No se registró la mascota.'); set(s => ({ pets: [...s.pets, mapPet(data)] })); },
  addAppointment: async app => { const data = requireSuccess(await supabase.from('appointments').insert({ pet_id: app.petId, clinic_id: app.clinicId, owner_id: app.ownerId, service: app.service, date: app.date, status: 'Confirmada' }).select().single(), 'No se creó la reserva.'); set(s => ({ appointments: [...s.appointments, mapAppointment(data)] })); },
  addUser: async user => { const response = await supabase.functions.invoke('invite-user', { body: user }); if (response.error) throw new Error(response.error.message); if (!response.data) throw new Error('No fue posible invitar al usuario.'); set(s => ({ users: [...s.users, response.data as User] })); },
  updateUserRole: async (id, role) => { const data = requireSuccess(await supabase.from('users').update({ role }).eq('id', id).select().single(), 'No se actualizó el rol.') as User; set(s => ({ users: s.users.map(u => u.id === id ? data : u) })); },
  deleteUser: async id => { requireSuccess(await supabase.from('users').delete().eq('id', id).select().single(), 'No se eliminó el usuario.'); set(s => ({ users: s.users.filter(u => u.id !== id) })); },
  addClinic: async clinic => { const data = requireSuccess(await supabase.from('clinics').insert({ owner_id: clinic.ownerId, name: clinic.name, address: clinic.address, phone: clinic.phone, subscription: clinic.subscription, services: clinic.services }).select().single(), 'No se creó la clínica.'); set(s => ({ clinics: [...s.clinics, mapClinic(data)] })); },
  updateClinicSubscription: async (id, subscription) => { const data = requireSuccess(await supabase.from('clinics').update({ subscription }).eq('id', id).select().single(), 'No se actualizó el plan.'); set(s => ({ clinics: s.clinics.map(c => c.id === id ? mapClinic(data) : c) })); },
  deleteClinic: async id => { requireSuccess(await supabase.from('clinics').delete().eq('id', id).select().single(), 'No se eliminó la clínica.'); set(s => ({ clinics: s.clinics.filter(c => c.id !== id) })); },
  addDoctor: async doctor => { const data = requireSuccess(await supabase.from('staff_doctors').insert({ clinic_id: doctor.clinicId, name: doctor.name, specialty: doctor.specialty, phone: doctor.phone }).select().single(), 'No se agregó el médico.'); set(s => ({ staffDoctors: [...s.staffDoctors, mapDoctor(data)] })); },
  deleteDoctor: async id => { requireSuccess(await supabase.from('staff_doctors').delete().eq('id', id).select().single(), 'No se eliminó el médico.'); set(s => ({ staffDoctors: s.staffDoctors.filter(d => d.id !== id) })); },
  addMedicalRecord: async record => { const data = requireSuccess(await supabase.from('medical_records').insert({ pet_id: record.petId, clinic_id: record.clinicId, doctor_name: record.doctorName, record_type: record.recordType, diagnosis: record.diagnosis, treatment: record.treatment, notes: record.notes }).select().single(), 'No se guardó la ficha clínica.'); set(s => ({ medicalRecords: [...s.medicalRecords, mapRecord(data)] })); },
  deleteAdoption: async id => { requireSuccess(await supabase.from('adoptions').delete().eq('id', id).select().single(), 'No se eliminó la publicación.'); set(s => ({ adoptions: s.adoptions.filter(a => a.id !== id) })); }
}));
