import React, { useEffect, useMemo, useState } from 'react';
import { isAuthenticated } from '../api/token';
import { useRouter } from 'next/router';
import RemindersApi from '../api/remindersApi';
import InventoryApi from '../api/inventoryApi';

const formatTime = (t) => {
  if (!t) return '—';
  const parts = String(t).split(':');
  return `${parts[0]?.padStart(2,'0')}:${parts[1]?.padStart(2,'0')}`;
};
const formatDateTime = (d) => {
  if (!d) return '—';
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '—';
    return dt.toLocaleString('es-ES', { hour12: false });
  } catch { return '—'; }
};

const fallbackDummies = [
  {
    id: 'dummy-1',
    inventoryId: null,
    remindTime: '08:00:00',
    frequency: 'DAILY',
    active: true,
    confirmedAt: null,
    lastSentAt: null
  },
  {
    id: 'dummy-2',
    inventoryId: null,
    remindTime: '21:30:00',
    frequency: 'WEEKLY',
    active: false,
    confirmedAt: '2025-10-29T07:20:00Z',
    lastSentAt: '2025-10-29T07:20:00Z'
  }
];

const Reminders = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addForm, setAddForm] = useState({
    inventoryId: '',
    remindTime: '',
    frequency: 'DAILY',
    active: true
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated()) return;

    let mounted = true;
    (async () => {
      try {
        const data = await RemindersApi.mine();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) {
          setItems(fallbackDummies);
          setError('No se pudo cargar desde el servidor. Modo demo con datos de prueba.');
        }
      } finally {
        try {
          const inv = await InventoryApi.mine();
          if (mounted) {
            const opts = (Array.isArray(inv) ? inv : []).map(x => ({ id: x.id, name: x.medicationName }));
            setInventoryOptions(opts);
          }
        } catch {
          if (mounted) setInventoryOptions([]);
        }
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const handleAddChange = (e) => {
    const { name, type, value, checked } = e.target;
    setAddForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!addForm.remindTime) {
      setError('Por favor indica la hora del recordatorio.');
      return;
    }
    if (!addForm.frequency) {
      setError('Por favor selecciona la frecuencia.');
      return;
    }

    const payload = {
      inventoryId: addForm.inventoryId || null,
      remindTime: addForm.remindTime,
      frequency: addForm.frequency,
      active: !!addForm.active
    };

    const tempId = `tmp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      ...payload,
      confirmedAt: null,
      lastSentAt: null
    };
    setItems(prev => [optimistic, ...prev]);
    setSaving(true);

    try {
      const res = await RemindersApi.add(payload);
      if (res?.data) {
        setItems(prev => {
          const copy = [...prev];
          const idx = copy.findIndex(x => x.id === tempId);
          if (idx >= 0) copy[idx] = { ...res.data };
          return copy;
        });
      }
      setShowAdd(false);
      setAddForm({ inventoryId: '', remindTime: '', frequency: 'DAILY', active: true });
      setSuccess(res?.display || 'Recordatorio creado');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setItems(prev => prev.filter(x => x.id !== tempId));
      setError(err?.message || 'Error creando recordatorio');
    } finally {
      setSaving(false);
    }
  };

  const rows = useMemo(() => Array.isArray(items) ? items : [], [items]);

  return (
    <div className="inventory-container">
      <div className="inventory-content">
        <div className="inventory-header">
          <button className="back-button" onClick={() => router.push('/')}>← Volver</button>
          <h1>Recordatorios</h1>
          <div style={{ marginLeft: 'auto' }}>
            <button className="main-button reminders-button" onClick={() => setShowAdd(true)}>
              Añadir
            </button>
          </div>
        </div>

        {error && <div className="error-text">{error}</div>}
        {success && <div className="success-text">{success}</div>}
        {loading && <p className="empty-state">Cargando...</p>}

        {!loading && (
          <div className="medications-table-container">
            <table className="medications-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Frecuencia</th>
                  <th>Activo</th>
                  <th>Confirmado</th>
                  <th>Último envío</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">No hay recordatorios</td>
                  </tr>
                ) : rows.map((r) => (
                  <tr key={r.id}>
                    <td className="expiration-date">{formatTime(r.remindTime)}</td>
                    <td>{r.frequency || '—'}</td>
                    <td>
                      {r.active ? (
                        <span className="status-badge low-stock-badge">Sí</span>
                      ) : (
                        <span className="status-badge expired-badge">No</span>
                      )}
                    </td>
                    <td className="date-added">{formatDateTime(r.confirmedAt)}</td>
                    <td className="date-added">{formatDateTime(r.lastSentAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showAdd && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 style={{ marginBottom: 16 }}>Añadir recordatorio</h2>
              <form onSubmit={handleAddSubmit} className="medication-form-grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Medicamento (opcional)</label>
                  <select
                    name="inventoryId"
                    value={addForm.inventoryId}
                    onChange={handleAddChange}
                    className="search-input"
                    style={{ width: '100%' }}
                  >
                    <option value="">— Sin asociar —</option>
                    {inventoryOptions.map(o => (
                      <option key={o.id} value={o.id}>{o.name} (#{o.id})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Hora</label>
                  <input
                    type="time"
                    name="remindTime"
                    value={addForm.remindTime}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-group">
                  <label>Frecuencia</label>
                  <select
                    name="frequency"
                    value={addForm.frequency}
                    onChange={handleAddChange}
                  >
                    <option value="DAILY">Diario</option>
                    <option value="WEEKLY">Semanal</option>
                    <option value="EVERY_8_HOURS">Cada 8 horas</option>
                    <option value="HOURLY">Cada hora</option>
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    id="active"
                    type="checkbox"
                    name="active"
                    checked={!!addForm.active}
                    onChange={handleAddChange}
                    style={{ width: 18, height: 18 }}
                  />
                  <label htmlFor="active" style={{ margin: 0 }}>Activo</label>
                </div>

                <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)} disabled={saving}>Cancelar</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reminders;
