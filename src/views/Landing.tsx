import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Calendar, Heart, Shield, ChevronRight, Stethoscope, Activity, Users } from 'lucide-react';
import './landing.css';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <PawPrint color="#0ea5e9" size={28} />
          <span>PETCARE PRO</span>
        </div>
        <button className="landing-login-btn" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </button>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">El cuidado de tu mascota, <span className="highlight">evolucionado</span></h1>
          <p className="hero-subtitle">
            Conecta con las mejores clínicas veterinarias, agenda visitas en segundos, y mantén el historial de salud de tus mascotas siempre al alcance de tu mano.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate('/login')}>
              Comenzar Ahora <ChevronRight size={18} />
            </button>
            <button className="secondary-btn">Conocer más</button>
          </div>
        </div>
        <div className="hero-graphic">
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400&h=400" alt="Perro feliz" style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', objectFit: 'cover', width: '100%', maxWidth: '320px', transform: 'rotate(-2deg)' }} />
          <div className="glass-card" style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '280px' }}>
            <div className="glass-header">
              <Calendar size={20} color="#0ea5e9" />
              <span>Próxima Visita</span>
            </div>
            <div className="glass-body">
              <strong>Consulta General - Milo</strong>
              <p>Mañana, 10:00 AM</p>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section className="landing-services">
        <h2>Servicios que ofrecemos</h2>
        <div className="services-carousel-wrapper">
          <div className="services-carousel">
            <div className="service-card">
            <img src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400&h=200" alt="Perro en veterinaria" className="service-img" />
            <div className="service-content">
              <div className="service-icon"><Stethoscope size={24} /></div>
              <h3>Agendamiento Rápido</h3>
              <p>Reserva citas con tu veterinario de confianza en un par de clics, sin llamadas ni esperas.</p>
            </div>
          </div>
          <div className="service-card">
            <img src="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80&w=400&h=200" alt="Dueño y mascota" className="service-img" />
            <div className="service-content">
              <div className="service-icon"><Shield size={24} /></div>
              <h3>Historial Médico</h3>
              <p>Accede al registro de vacunas, alergias y peso de tus mascotas desde cualquier dispositivo.</p>
            </div>
          </div>
          <div className="service-card">
            <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400&h=200" alt="Cachorro feliz" className="service-img" />
            <div className="service-content">
              <div className="service-icon"><Heart size={24} /></div>
              <h3>Red de Adopción</h3>
              <p>Encuentra a tu próximo mejor amigo o ayuda a mascotas a encontrar un hogar amoroso.</p>
            </div>
          </div>
          <div className="service-card">
            <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400&h=200" alt="Veterinario trabajando" className="service-img" />
            <div className="service-content">
              <div className="service-icon"><Activity size={24} /></div>
              <h3>CRM para Clínicas</h3>
              <p>Gestión completa de pacientes, inventario y finanzas diseñada específicamente para centros veterinarios.</p>
            </div>
          </div>
          <div className="service-card">
            <img src="https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&q=80&w=400&h=200" alt="Comunidad de mascotas" className="service-img" />
            <div className="service-content">
              <div className="service-icon"><Users size={24} /></div>
              <h3>Ventajas del Mercado</h3>
              <p>Únete a la red más grande de profesionales y dueños de mascotas. Mayor visibilidad y clientes para tu clínica.</p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="landing-advantages">
        <div className="advantages-content">
          <h2>¿Por qué elegir PetCare?</h2>
          <ul className="advantages-list">
            <li>
              <div className="adv-icon">✨</div>
              <div>
                <strong>Interfaz intuitiva y moderna</strong>
                <p>Diseñada para que dueños y doctores se enfoquen en lo importante: la salud animal.</p>
              </div>
            </li>
            <li>
              <div className="adv-icon">🔔</div>
              <div>
                <strong>Alertas automáticas</strong>
                <p>Notificaciones inmediatas cuando se agenda, modifica o cancela una visita.</p>
              </div>
            </li>
            <li>
              <div className="adv-icon">🔒</div>
              <div>
                <strong>Datos seguros en la nube</strong>
                <p>Toda la información está resguardada de manera privada y accesible 24/7.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" style={{ flexDirection: 'column', gap: '1rem', padding: '3rem 5%', textAlign: 'center' }}>
        <div className="footer-brand" style={{ justifyContent: 'center' }}>
          <PawPrint color="#0ea5e9" size={24} />
          <span>PETCARE PRO</span>
        </div>
        <p>© {new Date().getFullYear()} PetCare. Todos los derechos reservados.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#71717a' }}>
          Desarrollado por <a href="https://bastiascid.cl" target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 'bold' }}>Cristian Bastias</a>
        </p>
      </footer>
    </div>
  );
}
