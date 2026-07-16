import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { Login } from './views/Login';
import { OwnerLayout } from './views/owner/OwnerLayout';
import { VetLayout } from './views/vet/VetLayout';
import { AdminLayout } from './views/admin/AdminLayout';

export function App() {
  const { currentUser } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Redirección principal basada en rol */}
        <Route path="/" element={
          !currentUser ? <Navigate to="/login" /> :
          currentUser.role === 'ADMIN' ? <Navigate to="/admin" /> :
          currentUser.role === 'VET' ? <Navigate to="/vet" /> :
          <Navigate to="/owner" />
        } />

        {/* Rutas Privadas */}
        {currentUser?.role === 'OWNER' && (
          <Route path="/owner/*" element={<OwnerLayout />} />
        )}
        
        {currentUser?.role === 'VET' && (
          <Route path="/vet/*" element={<VetLayout />} />
        )}
        
        {currentUser?.role === 'ADMIN' && (
          <Route path="/admin/*" element={<AdminLayout />} />
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
