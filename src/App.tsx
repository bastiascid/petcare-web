import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { Landing } from './views/Landing';
import { Login } from './views/Login';
import { OwnerLayout } from './views/owner/OwnerLayout';
import { VetLayout } from './views/vet/VetLayout';
import { AdminLayout } from './views/admin/AdminLayout';

export function App() {
  const { currentUser, isLoading, fetchData } = useStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', color: '#64748b' }}>Cargando base de datos...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role.toLowerCase()}`} /> : <Login />} />
        
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
