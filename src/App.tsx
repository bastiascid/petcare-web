import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useStore } from './store';
import type { Role } from './types';
import { supabase } from './lib/supabase';
import { Landing } from './views/Landing';
import { Login } from './views/Login';
import { OwnerLayout } from './views/owner/OwnerLayout';
import { VetLayout } from './views/vet/VetLayout';
import { AdminLayout } from './views/admin/AdminLayout';

export function App() {
  const { currentUser, isLoading, initialize, error } = useStore();

  useEffect(() => {
    void initialize();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void initialize(); });
    return () => subscription.unsubscribe();
  }, [initialize]);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', color: '#64748b' }}>Cargando base de datos...</div>;
  }

  return (
    <BrowserRouter>
      {error && <div role="alert" style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 20, maxWidth: 420, background: '#7f1d1d', color: '#fff', padding: '12px 16px', borderRadius: 8 }}>{error}</div>}
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role.toLowerCase()}`} /> : <Login />} />
        
        {/* Rutas Privadas */}
        <Route element={<RequireRole role="OWNER" />}><Route path="/owner/*" element={<OwnerLayout />} /></Route>
        <Route element={<RequireRole role="VET" />}><Route path="/vet/*" element={<VetLayout />} /></Route>
        <Route element={<RequireRole role="ADMIN" />}><Route path="/admin/*" element={<AdminLayout />} /></Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

function RequireRole({ role }: { role: Role }) {
  const currentUser = useStore(s => s.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== role) return <Navigate to={`/${currentUser.role.toLowerCase()}`} replace />;
  return <Outlet />;
}
