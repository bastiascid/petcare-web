import { create } from 'zustand';
import { User, Clinic, Pet, Alert, AdoptionPost } from './types';

// Datos de prueba iniciales
const mockUsers: User[] = [
  { id: 'admin1', name: 'Administrador Web', email: 'admin@petcare.com', role: 'ADMIN' },
  { id: 'vet1', name: 'Dr. Juan Pérez', email: 'juan@clinicavet.com', role: 'VET' },
  { id: 'owner1', name: 'Carolina Morales', email: 'caro@mail.com', role: 'OWNER', address: 'Av. Siempre Viva 123' },
];

const mockClinics: Clinic[] = [
  { id: 'c1', ownerId: 'vet1', name: 'Clínica Vet Andes', address: 'Providencia 1234', phone: '+56912345678', subscription: 'PREMIUM', services: ['Consulta', 'Vacunas', 'Cirugía'] },
];

const mockPets: Pet[] = [
  { id: 'p1', ownerId: 'owner1', name: 'Milo', species: 'Perro', breed: 'Labrador', sex: 'Macho', birth: '2021-04-12', weight: 29.4, color: 'Dorado', allergies: 'Pollo' },
];

const mockAdoptions: AdoptionPost[] = [
  { id: 'a1', creatorId: 'owner1', petName: 'Pelusa', species: 'Gato', age: '3 meses', description: 'Gatita muy juguetona buscando hogar', contactPhone: '+56987654321', status: 'AVAILABLE', datePosted: new Date().toISOString() }
];

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

  // Acciones
  addAlert: (alert: Omit<Alert, 'id' | 'date'>) => void;
  markAlertRead: (id: string) => void;
  addAdoption: (post: Omit<AdoptionPost, 'id' | 'datePosted' | 'status'>) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: mockUsers,
  
  clinics: mockClinics,
  pets: mockPets,
  alerts: [],
  adoptions: mockAdoptions,

  login: (email: string) => {
    const user = get().users.find(u => u.email === email);
    if (user) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  logout: () => set({ currentUser: null }),

  addAlert: (alert) => {
    const newAlert: Alert = { ...alert, id: Date.now().toString(), date: new Date().toISOString() };
    set(state => ({ alerts: [...state.alerts, newAlert] }));
  },

  markAlertRead: (id) => {
    set(state => ({
      alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a)
    }));
  },

  addAdoption: (post) => {
    const newPost: AdoptionPost = { ...post, id: Date.now().toString(), datePosted: new Date().toISOString(), status: 'AVAILABLE' };
    set(state => ({ adoptions: [...state.adoptions, newPost] }));
  }
}));
