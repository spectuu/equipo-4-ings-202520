import React, { useState, useEffect } from 'react';
import { isAuthenticated, removeToken, getUserFromToken } from '../api/token';
import { useRouter } from 'next/router';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    removeToken();
    router.push('/login');
    setIsOpen(false);
  };

  const handleProfile = () => {
    console.log('Ir al perfil (no implementado)');
    setIsOpen(false);
  };

  return (
    <div className="user-menu">
      <button className="user-menu-button" onClick={toggleMenu}>
        P
      </button>
      {isOpen && (
        <div className="user-menu-dropdown">
          <button onClick={handleProfile} className="menu-item">
            Ir al perfil
          </button>
          <button onClick={handleLogout} className="menu-item">
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [displayName, setDisplayName] = useState('Usuario');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      const dateString = now.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric',
        month: 'long'
      });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateDateTime();
    const user = getUserFromToken();
    const name = user?.username || user?.name || user?.sub || 'Usuario';
    setDisplayName(name);
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, [router]);

  const mockReminders = [
    {
      time: '7:30 pm',
      medication: 'Paracetamol 500mg'
    },
    {
      time: '9:00 pm',
      medication: 'Vitamina C'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-content">
        {}
        <div className="home-header">
          <div className="greeting">
            <h1>Hola, {displayName} 👋</h1>
          </div>
          <UserMenu />
        </div>

        {}
        <div className="datetime-section">
          <p className="current-date">{currentDate}</p>
          <h2 className="current-time">{currentTime}</h2>
        </div>

        {}
        <div className="reminders-section">
          <h3>Próximos recordatorios</h3>
          <div className="reminders-list">
            {mockReminders.map((reminder, index) => (
              <div key={index} className="reminder-item">
                <div className="reminder-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
                <div className="reminder-content">
                  <div className="reminder-time">{reminder.time}</div>
                  <div className="reminder-medication">{reminder.medication}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="main-buttons">
          <button 
            className="main-button inventory-button"
            onClick={() => router.push('/inventory')}
          >
            Inventario
          </button>
          <button className="main-button reminders-button">
            Recordatorios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
