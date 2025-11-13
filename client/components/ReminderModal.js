import { useState, useEffect } from "react";
import ReminderApi from "../api/remindersApi";
import InventoryApi from "../api/inventoryApi";

export default function ReminderModal({ onClose, onSaved, editData }) {
  const [inventoryId, setInventoryId] = useState(editData?.inventoryId || "");
  const [remindTime, setRemindTime] = useState(editData?.remindTime || "08:00");
  const [frequency, setFrequency] = useState(editData?.frequency || "daily");
  const [active, setActive] = useState(editData?.active ?? true);
  const [error, setError] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loadingMeds, setLoadingMeds] = useState(false);
  
  useEffect(() => {
    if (!editData) {
      setLoadingMeds(true);
      InventoryApi.mine().then(data => {
        setMedications(Array.isArray(data) ? data : []);
        setLoadingMeds(false);
      }).catch(err => {
        setError("No se pudieron cargar los medicamentos");
        setMedications([]);
        setLoadingMeds(false);
      });
    }
  }, [editData]);

  async function save() {
    try {
      if (editData) {
        // Asegurar que el ID sea un entero válido
        const reminderId = parseInt(editData.id, 10);
        if (isNaN(reminderId) || reminderId <= 0) {
          setError("ID de recordatorio inválido");
          return;
        }
        // Solo enviar los campos que el backend espera para actualizar
        await ReminderApi.update(reminderId, {
          remindTime,
          frequency,
          active,
        });
      } else {
        await ReminderApi.create({
          inventoryId,
          remindTime,
          frequency,
        });
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="reminder-modal-overlay">
      <div className="reminder-modal-content">
        <h2 className="reminder-modal-title">{editData ? "Editar Recordatorio" : "Nuevo Recordatorio"}</h2>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={e => { e.preventDefault(); save(); }}>
        <div className="form-group">
          {!editData && (
            <>
              <label>Medicamento</label>
              {loadingMeds ? (
                <div style={{color: '#888'}}>Cargando medicamentos...</div>
              ) : medications.length === 0 ? (
                <div style={{color: '#c00', fontSize: '15px'}}>No tienes medicamentos en tu inventario</div>
              ) : (
                <select value={inventoryId} onChange={e => setInventoryId(e.target.value)} required>
                  <option value="">Seleccione...</option>
                  {medications.map(med => (
                    <option key={med.id} value={med.id}>{med.medicationName || med.name || `ID ${med.id}`}</option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>
        <div className="form-group">
          <label>Hora</label>
          <input type="time" value={remindTime} onChange={e => setRemindTime(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Frecuencia</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value)} required>
            <option value="once">Una vez</option>
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
          </select>
        </div>

        {editData && (
          <div className="form-group">
            <label>Activo</label>
            <input type="checkbox" checked={active} onChange={() => setActive(!active)} />
          </div>
        )}
        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loadingMeds || (!editData && !inventoryId)}>
            Guardar
          </button>
          <button className="btn-secondary" type="button" onClick={onClose}>Cerrar</button>
        </div>
        </form>

        <style jsx>{`
          .reminder-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .reminder-modal-content {
            background: #fff;
            width: 100%;
            max-width: 370px;
            border-radius: 14px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
            padding: 32px 28px;
            display: flex;
            flex-direction: column;
          }
          .reminder-modal-title {
            font-size: 22px;
            font-weight: 600;
            color: #222;
            margin-bottom: 20px;
            text-align: center;
          }
          .form-group {
            margin-bottom: 22px;
            display: flex;
            flex-direction: column;
          }
          .form-group label {
            margin-bottom: 7px;
            color: #444;
            font-size: 15px;
          }
          .form-group input[type="number"],
          .form-group input[type="time"],
          .form-group select {
            background: #fafafa;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: 15px;
            padding: 10px 12px;
            color: #222;
            outline: none;
            transition: border-color .2s;
          }
          .form-group input[type="number"]:focus,
          .form-group input[type="time"]:focus,
          .form-group select:focus {
            border-color: #4A90E2;
          }
          .form-group input[type="checkbox"] {
            width: 22px; height: 22px;
            margin-left: 0;
          }
          .form-actions {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-top: 16px;
          }
        `}</style>
      </div>
    </div>
  );
}
