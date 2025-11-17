import { useEffect, useState } from "react";
import ReminderApi from "../api/remindersApi";
import InventoryApi from "../api/inventoryApi";
import { isAuthenticated, getUserFromToken } from "../api/token";
import { useRouter } from "next/router";
import ReminderModal from "../components/ReminderModal";

export default function RemindersPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState(null);

  // Filtros
  const [filter, setFilter] = useState("all");
  const [freqFilter, setFreqFilter] = useState("");
  const [medFilter, setMedFilter] = useState("");

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [data, meds] = await Promise.all([
        ReminderApi.mine(),
        InventoryApi.mine()
      ]);
      console.log("Reminders received:", data);
      console.log("Medications received:", meds);
      setReminders(Array.isArray(data) ? data : []);
      setMedications(Array.isArray(meds) ? meds : []);
      setError(null); // clear error after successful fetch
    } catch (err) {
      console.error("Error loading reminders/medications:", err);
      setError(cleanError(err.message) || "Error cargando recordatorios");
    }
    setLoading(false);
  }

  function getMedName(id) {
    const med = medications.find((m) => m.id === id);
    return med ? med.medicationName || med.name || `ID ${id}` : `ID ${id}`;
  }

  // === Filtrado ===
  function matchFiltro(r) {
    if (filter === "all") return true;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (filter === "pending") {
      return r.active && (!r.takenDate || r.takenDate.split('T')[0] !== today);
    }
    if (filter === "done") {
      return r.active && r.takenDate && r.takenDate.split('T')[0] === today;
    }
    if (filter === "inactive") return r.active === false;
    if (filter === "active") return r.active === true;
    return true;
  }
  const filteredReminders = reminders.filter(r => matchFiltro(r))
    .filter(r => !freqFilter || r.frequency === freqFilter)
    .filter(r => !medFilter || getMedName(r.inventoryId).toLowerCase().includes(medFilter.toLowerCase()));
  
  console.log("Total reminders:", reminders.length);
  console.log("Filtered reminders:", filteredReminders.length);
  console.log("Current filter:", filter);

  // === Check tomado ===
  async function toggleTaken(reminder) {
    const today = new Date().toISOString();
    const newTaken = !reminder.takenDate || reminder.takenDate.split('T')[0] !== today;
    try {
      await ReminderApi.update(reminder.id, {
        ...reminder,
        takenDate: newTaken ? today : null
      });
      loadAll();
    } catch (err) {
      alert("Error actualizando recordatorio");
    }
  }

  function openCreateModal() {
    setEditData(null);
    setModalOpen(true);
  }

  function openEditModal(reminder) {
    setEditData(reminder);
    setModalOpen(true);
  }

  async function deleteReminder(id) {
    if (!confirm("¿Eliminar este recordatorio?")) return;

    try {
      await ReminderApi.remove(id);
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  }

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
      alert("Error actualizando recordatorio");
    }
  }

  const cleanError = (msg) => {
    if (!msg || msg.toLowerCase().trim() === 'ok') return null;
    return msg;
  };

  return (
    <div className="reminders-container" style={{background: '#fff', minHeight:'100vh'}}>
      <div className="reminders-content">
        <div className="reminders-header">
          <button 
            className="back-button" 
            onClick={() => router.push('/')}
          >
            ← Volver
          </button>
          <h1>Mis Recordatorios</h1>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="main-buttons" style={{marginBottom:20}}>
          <button className="main-button reminders-button" onClick={openCreateModal}>
            + Crear Recordatorio
          </button>
        </div>

        <div className="reminders-filters" style={{marginBottom:20}}>
          <select 
            className="filter-select"
            value={filter} 
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes hoy</option>
            <option value="done">Tomados hoy</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
          </select>
          <select 
            className="filter-select"
            value={freqFilter} 
            onChange={e => setFreqFilter(e.target.value)}
          >
            <option value="">Filtrar frecuencia</option>
            <option value="once">Una vez</option>
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
          </select>
          <input
            className="filter-input"
            value={medFilter}
            placeholder="Buscar recordatorio..."
            onChange={e => setMedFilter(e.target.value)}
          />
        </div>
        {loading ? (
          <p style={{padding: '20px', textAlign: 'center', color: '#666'}}>Cargando...</p>
        ) : reminders.length === 0 ? (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            color: '#495057',
            marginTop: '20px'
          }}>
            <p style={{margin: 0, fontSize: '16px', fontWeight: 500}}>No tienes recordatorios aún.</p>
            <p style={{margin: '8px 0 0 0', fontSize: '14px', color: '#6c757d'}}>Crea uno para comenzar.</p>
          </div>
        ) : filteredReminders.length === 0 ? (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            background: '#fff3cd',
            borderRadius: '8px',
            border: '1px solid #ffc107',
            color: '#856404',
            marginTop: '20px'
          }}>
            <p style={{margin: 0, fontSize: '16px', fontWeight: 500}}>No hay recordatorios que coincidan con el filtro seleccionado.</p>
            <p style={{margin: '8px 0 0 0', fontSize: '14px'}}>Total de recordatorios: {reminders.length}</p>
          </div>
        ) : (
          <div className="reminders-list-table-container" style={{overflowX:'auto'}}>
            <table className="reminders-table">
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Hora</th>
                  <th>Frecuencia</th>
                  <th>Activo</th>
                  <th>Tomado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredReminders.map((r) => {
                  const isToday = r.takenDate && r.takenDate.split('T')[0] === new Date().toISOString().split('T')[0];
                  return (
                    <tr key={r.id}>
                      <td style={{color:'#333',fontWeight:500}}>{getMedName(r.inventoryId)}</td>
                      <td style={{color:'#333',fontSize:'15px'}}>{r.remindTime}</td>
                      <td style={{color:'#333',fontSize:'15px'}}>{r.frequency}</td>
                      <td>
                        <span style={{
                          display:'inline-block',padding:'4px 12px',borderRadius:12,
                          background:r.active?'#d1fae5':'#fee2e2', color:r.active?'#065f46':'#991b1b',
                          fontWeight:600,fontSize:13,minWidth:60,textAlign:'center'}}>{r.active ? 'Activo' : 'Inactivo'}</span>
                      </td>
                      <td>
                        <label style={{cursor:r._toggleLoading?'wait':'pointer',display:'flex',alignItems:'center'}} title={isToday?"Ya marcaste este recordatorio como tomado hoy":"Marcar como tomado hoy"}>
                          <input type="checkbox" checked={isToday} disabled={r._toggleLoading} onChange={() => handleCheckbox(r)} style={{marginRight:10,accentColor:isToday?'#22c55e':'#aaa'}} />
                          <span style={{
                            display:'inline-block',padding:'4px 12px',borderRadius:12,
                            background:isToday?'#d1fae5':'#e5e7eb', color:isToday?'#065f46':'#1f2937', fontWeight:600,fontSize:13,transition:'all .2s'
                          }}>{isToday?'Tomado':'Pendiente'}</span>
                          {r._toggleLoading && <span style={{marginLeft:8, fontSize:17, color:'#bbb',display:'inline-block',height:18}} className="spinner"></span>}
                        </label>
                      </td>
                      <td>
                        <button className="edit-button" onClick={() => openEditModal(r)}>Editar</button>
                        <button className="delete-btn" onClick={() => deleteReminder(r.id)}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {modalOpen && (
          <ReminderModal
            onClose={() => setModalOpen(false)}
            onSaved={() => {
              setModalOpen(false);
              loadAll();
            }}
            editData={editData}
          />
        )}

        <style jsx>{`
          .reminders-container {
            min-height: 100vh;
            background-color: #f5f5f5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .reminders-content {
            background-color: white;
            min-height: 100vh;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
          }
          .reminders-filters {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
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
            box-shadow: 0 1px 2px rgba(0,0,0,0.04) inset;
          }
          .filter-select:focus {
            outline: none;
            border-color: #4A90E2;
          }
          .filter-input {
            padding: 12px 14px;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            font-size: 15px;
            background-color: #fff;
            color: #333;
            transition: border-color 0.2s ease;
            min-width: 200px;
            flex: 1;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04) inset;
          }
          .filter-input:focus {
            outline: none;
            border-color: #4A90E2;
          }
          .filter-input::placeholder {
            color: #999;
          }
          .reminders-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
          }
          .reminders-header h1 {
            font-size: 28px;
            font-weight: 500;
            color: #333;
            margin: 0;
          }
          .main-buttons { display: flex; gap: 16px; margin-bottom: 20px; }
          .main-button.reminders-button {
            background-color: #4A90E2;
            color: white;
            padding: 20px;
            border: none;
            border-radius: 16px;
            font-size: 16px;
            font-weight: 500;
            transition: background 0.2s;
            flex: 1;
          }
          .main-button.reminders-button:hover {
            background-color: #357ABD;
          }
          .back-button {
            background: none;
            border: 1px solid #ddd;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            color: #666;
            transition: all 0.2s;
          }
          .back-button:hover {
            background-color: #f0f0f0;
            border-color: #bbb;
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
          .edit-button {
            padding: 6px 10px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            background: #f8f9fa;
            color: #333;
            font-size: 12px;
            cursor: pointer;
            margin-right: 8px;
            transition: all .15s ease;
          }
          .edit-button:hover {
            background: #eef2f7;
            border-color: #d0d7de;
          }
          .delete-btn {
            color: white;
            background: #d33;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            margin-left: 6px;
            font-size: 12px;
            cursor: pointer;
          }
          .delete-btn:hover {
            background: #b32424;
          }
          .error-text {
            color: #7f1d1d;
            background: #fee2e2;
            border: 1px solid #fecaca;
            padding: 10px 12px;
            border-radius: 8px;
            margin-bottom: 20px;
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
    </div>
  );
}
