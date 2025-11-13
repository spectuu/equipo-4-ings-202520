import React, { useState, useEffect } from 'react';
import { isAuthenticated, removeToken, getUserFromToken } from '../api/token';
import { useRouter } from 'next/router';
import ReminderApi from '../api/remindersApi';
import InventoryApi from '../api/inventoryApi';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    removeToken();
    router.push('/login');
    setIsOpen(false);
  };

  return (
    <div className="user-menu">
      <button className="user-menu-button" onClick={toggleMenu}>
        P
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <button onClick={() => console.log("Perfil no implementado")} className="menu-item">
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

/* ---------------------------------------------------------
   HOME
--------------------------------------------------------- */
const Home = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [displayName, setDisplayName] = useState('Usuario');
  const [reminders, setReminders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [error, setError] = useState(null);

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
        hour12: false,
      });

      const dateString = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });

      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    const userData = getUserFromToken();
    const name = userData?.username || userData?.name || userData?.sub || 'Usuario';
    setDisplayName(name);

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    async function loadAll() {
      try {
        const [rems, meds] = await Promise.all([
          ReminderApi.mine(),
          InventoryApi.mine()
        ]);
        console.log("Home - Reminders received:", rems);
        console.log("Home - Medications received:", meds);
        setReminders(Array.isArray(rems) ? rems.slice(0, 3) : []);
        setMedications(Array.isArray(meds) ? meds : []);
        setError(null);
      } catch (err) {
        console.error("Error loading reminders/medications:", err);
        setError(cleanError(err.message) || "No se pudieron cargar recordatorios");
      }
    }
    if (isAuthenticated()) {
      loadAll();
    }
  }, []);

  function getMedName(id) {
    const med = medications.find(m => m.id === id);
    return med ? med.medicationName || med.name || `ID ${id}` : `ID ${id}`;
  }
  const [reminderFilter, setReminderFilter] = useState('all');
  function filterReminders(r) {
    if (reminderFilter === 'all') return true;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (reminderFilter === 'pending') return r.active && (!r.takenDate || r.takenDate.split('T')[0] !== today);
    if (reminderFilter === 'done') return r.active && r.takenDate && r.takenDate.split('T')[0] === today;
    return true;
  }
  const cleanError = (msg) => {
    if (!msg || msg.toLowerCase().trim() === 'ok') return null;
    return msg;
  };
  async function handleCheckbox(reminder) {
    setReminders(rs => rs.map(r=>r.id===reminder.id?{...r,_toggleLoading:true}:r));
    const today = new Date().toISOString();
    const newTaken = !reminder.takenDate || reminder.takenDate.split('T')[0] !== today;
    try {
      // Solo enviar los campos que el backend espera para actualizar
      await ReminderApi.update(reminder.id, {
        remindTime: reminder.remindTime,
        frequency: reminder.frequency,
        active: reminder.active,
        takenDate: newTaken ? today : null
      });
      setReminders(rs => rs.map(r=>r.id===reminder.id?{...r, takenDate: newTaken? today: null, _toggleLoading:false}:r));
    } catch (err) {
      setReminders(rs=>rs.map(r=>r.id===reminder.id?{...r,_toggleLoading:false}:r));
      setError(cleanError(err.message) || "Error actualizando recordatorio");
    }
  }

  return (
    <div className="home-container">
      <div className="home-content">
        

        <div className="home-header">
          <div className="greeting">
            <h1>Hola, {displayName} 👋</h1>
          </div>
          <UserMenu />
        </div>

        <div className="datetime-section">
          <p className="current-date">{currentDate}</p>
          <h2 className="current-time">{currentTime}</h2>
        </div>

        <div className="reminders-section">
          <h3>Próximos recordatorios</h3>
          <div className="reminders-filters" style={{marginBottom:16}}>
            <select 
              className="filter-select"
              value={reminderFilter} 
              onChange={e=>setReminderFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes hoy</option>
              <option value="done">Tomados hoy</option>
            </select>
          </div>
          {reminders.filter(r=>filterReminders(r)).length === 0 ? (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              color: '#495057',
              marginBottom: '16px'
            }}>
              <p style={{margin: 0, fontSize: '15px'}}>No hay recordatorios para mostrar.</p>
            </div>
          ) : (
          <div className="reminders-list-table-container" style={{overflowX:'auto', marginBottom:16}}>
            <table className="reminders-table">
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Hora</th>
                  <th>Frecuencia</th>
                  <th>Tomado</th>
                </tr>
              </thead>
              <tbody>
                {reminders.filter(r=>filterReminders(r)).map((r) => {
                  const isToday = r.takenDate && r.takenDate.split('T')[0] === new Date().toISOString().split('T')[0];
                  return (
                    <tr key={r.id}>
                      <td style={{color:'#333',fontWeight:500}}>
                        <span style={{cursor:'pointer',color:'#2563eb',textDecoration:'underline'}} onClick={()=>router.push('/reminders')}>{getMedName(r.inventoryId)}</span>
                      </td>
                      <td style={{color:'#333',fontSize:'15px'}}>{r.remindTime}</td>
                      <td style={{color:'#333',fontSize:'15px'}}>{r.frequency}</td>
                      <td>
                        <label style={{cursor:r._toggleLoading?'wait':'pointer',display:'flex',alignItems:'center'}} title={isToday?'Ya registrado como tomado hoy':'Marcar como tomado'}>
                          <input
                            type="checkbox"
                            checked={isToday}
                            disabled={!!r._toggleLoading}
                            onChange={()=>handleCheckbox(r)}
                            style={{marginRight:8,accentColor:isToday?'#22c55e':'#aaa'}}
                          />
                          <span style={{
                            display:'inline-block',padding:'4px 12px',borderRadius:12,
                            background:isToday?'#d1fae5':'#e5e7eb', color:isToday?'#065f46':'#1f2937', fontWeight:600,fontSize:13,transition:'all .2s'
                          }}>{isToday?'Tomado':'Pendiente'}</span>
                          {r._toggleLoading && <span style={{marginLeft:8, fontSize:17, color:'#bbb',display:'inline-block',height:18}} className="spinner"></span>}
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>

        <div className="main-buttons">
          <button 
            className="main-button inventory-button"
            onClick={() => router.push('/inventory')}
          >
            Inventario
          </button>

          <button 
            className="main-button reminders-button"
            onClick={() => router.push('/reminders')}
          >
            Recordatorios
          </button>
        </div>

      </div>
      <style jsx>{`
        .reminders-filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .filter-select {
          padding: 12px 14px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          font-size: 15px;
          background-color: #fff;
          color: #333;
          cursor: pointer;
          transition: border-color 0.2s ease;
          min-width: 160px;
        }
        .filter-select:focus {
          outline: none;
          border-color: #4A90E2;
        }
        .reminders-list-table-container {
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          margin-bottom: 20px;
          overflow-x: auto;
        }
        .reminders-table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
        }
        .reminders-table th {
          background-color: #f8f9fa;
          padding: 16px;
          text-align: left;
          font-weight: 600;
          color: #555;
          border-bottom: 2px solid #e9ecef;
          font-size: 14px;
        }
        .reminders-table td {
          padding: 16px 12px;
          border-bottom: 1px solid #e9ecef;
          font-size: 15px;
          color: #333;
        }
        .reminders-table tr:hover {
          background-color: #f8f9fa;
        }
        .spinner {
          width: 16px; height: 16px; border:2px solid #ccc; border-top:2px solid #4A90E2; border-radius:50%; display:inline-block; animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0%{transform:rotate(0deg);}
          100%{transform:rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

export default Home;
