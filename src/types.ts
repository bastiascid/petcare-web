export type Role = 'ADMIN' | 'VET' | 'OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  address?: string; // Para dueños
}

export interface Clinic {
  id: string;
  name: string;
  ownerId: string;
  address: string;
  phone: string;
  subscription: 'FREE' | 'PRO' | 'PREMIUM';
  services: string[];
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed: string;
  sex: string;
  birth: string;
  weight: number;
  color: string;
  allergies?: string;
}

export interface Alert {
  id: string;
  senderId: string;
  receiverId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Appointment {
  id: string;
  petId: string;
  clinicId: string;
  ownerId: string;
  service: string;
  date: string; // ISO String
  status: 'Confirmada' | 'Pendiente' | 'Realizada';
}

export interface AdoptionPost {
  id: string;
  creatorId: string; // Quien lo publica
  petName: string;
  species: string;
  age: string;
  description: string;
  contactPhone: string;
  status: 'AVAILABLE' | 'ADOPTED';
  datePosted: string;
}
