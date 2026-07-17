import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Calendar, Heart, Shield, ChevronRight, Stethoscope } from 'lucide-react';
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
          <div className="glass-card">
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
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon"><Stethoscope size={24} /></div>
            <h3>Agendamiento Rápido</h3>
            <p>Reserva citas con tu veterinario de confianza en un par de clics, sin llamadas ni esperas.</p>
          </div>
          <div className="service-card">
            <div className="service-icon"><Shield size={24} /></div>
            <h3>Historial Médico</h3>
            <p>Accede al registro de vacunas, alergias y peso de tus mascotas desde cualquier dispositivo.</p>
          </div>
          <div className="service-card">
            <div className="service-icon"><Heart size={24} /></div>
            <h3>Red de Adopción</h3>
            <p>Encuentra a tu próximo mejor amigo o ayuda a mascotas a encontrar un hogar amoroso.</p>
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
      <footer className="landing-footer">
        <div className="footer-brand">
          <PawPrint color="#0ea5e9" size={24} />
          <span>PETCARE PRO</span>
        </div>
        <p>© {new Date().getFullYear()} PetCare. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
