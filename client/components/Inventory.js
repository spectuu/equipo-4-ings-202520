import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../api/token';
import { useRouter } from 'next/router';
import InventoryApi from '../api/inventoryApi';

const Inventory = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [router]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    medicationName: '',
    quantity: '',
    unit: '',
    lotCode: '',
    expires: '',
    medicationDescription: ''
  });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ quantity: '', unit: '', lotCode: '', expires: '' });

  useEffect(() => {
    if (!isAuthenticated()) return;
    let mounted = true;
    const load = async () => {
      try {
        const data = await InventoryApi.mine();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err?.message || 'Error cargando inventario');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Debounced search when query changes
  useEffect(() => {
    let active = true;
    const handler = setTimeout(async () => {
      if (!active) return;
      setSearching(true);
      try {
        if (query.trim().length === 0) {
          const data = await InventoryApi.mine();
          if (active) setItems(Array.isArray(data) ? data : []);
        } else {
          const data = await InventoryApi.search(query.trim());
          if (active) setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) setError(err?.message || 'Error en la búsqueda');
      } finally {
        if (active) setSearching(false);
      }
    }, 350);
    return () => { active = false; clearTimeout(handler); };
  }, [query]);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const result = await InventoryApi.add({
        medicationName: addForm.medicationName.trim(),
        quantity: Number(addForm.quantity || 0),
        unit: addForm.unit.trim() || null,
        lotCode: addForm.lotCode.trim() || null,
        expires: addForm.expires || null,
        medicationDescription: addForm.medicationDescription.trim() || null
      });
      // recargar lista
      setLoading(true);
      const data = await InventoryApi.mine();
      setItems(Array.isArray(data) ? data : []);
      setShowAdd(false);
      setAddForm({ medicationName: '', quantity: '', unit: '', lotCode: '', expires: '', medicationDescription: '' });
      setSuccess(result?.display || 'Medicamento guardado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.message || 'No se pudo agregar');
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      quantity: String(item.quantity ?? ''),
      unit: item.unit || '',
      lotCode: item.lotCode || '',
      expires: (item.expires ? String(item.expires).slice(0,10) : '')
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        quantity: editForm.quantity === '' ? null : Number(editForm.quantity),
        unit: editForm.unit || null,
        lotCode: editForm.lotCode || null,
        expires: editForm.expires || null
      };
      await InventoryApi.update(editingId, payload);
      const data = await InventoryApi.mine();
      setItems(Array.isArray(data) ? data : []);
      setEditingId(null);
      setSuccess('Medicamento actualizado');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.message || 'No se pudo actualizar');
      setTimeout(() => setError(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const toDateOrNull = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (value) => {
    const date = toDateOrNull(value);
    if (!date) return '-';
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isExpiringSoon = (expirationDate) => {
    const today = new Date();
    const expDate = toDateOrNull(expirationDate);
    if (!expDate) return false;
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isExpired = (expirationDate) => {
    const today = new Date();
    const expDate = toDateOrNull(expirationDate);
    if (!expDate) return false;
    return expDate < today;
  };

  const getName = (item) => item.medicationName || item.name || item.medName || '';
  const getDescription = (item) => item.medicationDescription || item.description || '';
  const getExpires = (item) => item.expires || item.expirationDate || item.expiryDate || null;
  const getCreatedAt = (item) => item.createdAt || item.dateAdded || item.addedAt || null;

  return (
    <div className="inventory-container">
      <div className="inventory-content">
        {/* Header */}
        <div className="inventory-header">
          <button 
            className="back-button" 
            onClick={() => router.push('/')}
          >
            ← Volver
          </button>
          <h1>Inventario de Medicamentos</h1>
          <div style={{ marginLeft: 'auto' }}>
            <div className="search-container">
              <span className="search-icon" aria-hidden>🔎</span>
              <input
                className="search-input"
                placeholder="Buscar por nombre..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button className="clear-btn" onClick={() => setQuery('')} type="button" aria-label="Limpiar">×</button>
              )}
            </div>
            <button className="main-button inventory-button" onClick={() => setShowAdd(true)}>
              Añadir
            </button>
          </div>
        </div>

        {/* Tabla de medicamentos */}
        <div className="medications-table-container">
          <table className="medications-table">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Unidad</th>
                <th>Lote</th>
                <th>Fecha de Expiración</th>
                <th>Fecha de Adición</th>
              </tr>
            </thead>
            <tbody>
              {items.map((medication) => (
                <tr 
                  key={medication.id}
                  className={`
                    ${isExpired(getExpires(medication)) ? 'expired' : ''}
                    ${isExpiringSoon(getExpires(medication)) ? 'expiring-soon' : ''}
                    ${isLowStock(medication) ? 'low-stock' : ''}
                  `}
                >
                  <td className="medication-name">
                    {getName(medication)}
                    {isExpired(getExpires(medication)) && (
                      <span className="status-badge expired-badge">Vencido</span>
                    )}
                    {isExpiringSoon(getExpires(medication)) && !isExpired(getExpires(medication)) && (
                      <span className="status-badge warning-badge">Por vencer</span>
                    )}
                    {isLowStock(medication) && (
                      <span className="status-badge low-stock-badge">Pocas unidades</span>
                    )}
                  </td>
                  <td className="medication-description">{getDescription(medication)}</td>
                  <td className="quantity-cell">{medication.quantity}</td>
                  <td className="unit-cell">{medication.unit}</td>
                  <td className="lot-cell">{medication.lotCode}</td>
                  <td className="expiration-date">{formatDate(getExpires(medication))}</td>
                  <td className="date-added">{formatDate(getCreatedAt(medication))}</td>
                  <td>
                    <button className="edit-button" onClick={() => openEdit(medication)}>
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && items.length === 0 && !error && (
          <p className="empty-state">No hay medicamentos en tu inventario.</p>
        )}

        {/* Resumen */}
        <div className="inventory-summary">
          <div className="summary-item">
            <span className="summary-number">{items.length}</span>
            <span className="summary-label">Total de medicamentos</span>
          </div>
          <div className="summary-item warning">
            <span className="summary-number">
              {items.filter(m => isExpiringSoon(getExpires(m)) && !isExpired(getExpires(m))).length}
            </span>
            <span className="summary-label">Por vencer (30 días)</span>
          </div>
          <div className="summary-item danger">
            <span className="summary-number">
              {items.filter(m => isExpired(getExpires(m))).length}
            </span>
            <span className="summary-label">Vencidos</span>
          </div>
          <div className="summary-item" style={{ borderLeft: '4px solid #0891b2' }}>
            <span className="summary-number">
              {items.filter(isLowStock).length}
            </span>
            <span className="summary-label">Pocas unidades (≤5)</span>
          </div>
        </div>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        {showAdd && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 style={{marginBottom: 16}}>Registrar medicamento</h2>
              <form onSubmit={handleAddSubmit} className="medication-form-grid">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    name="medicationName"
                    value={addForm.medicationName}
                    onChange={handleAddChange}
                    placeholder="Ej: Ibuprofeno 400mg"
                    maxLength={120}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cantidad</label>
                  <input
                    name="quantity"
                    type="number"
                    min="0"
                    value={addForm.quantity}
                    onChange={handleAddChange}
                    placeholder="Ej: 24"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unidad</label>
                  <input
                    name="unit"
                    value={addForm.unit}
                    onChange={handleAddChange}
                    placeholder="Tabletas / ml / cápsulas"
                    maxLength={16}
                  />
                </div>
                <div className="form-group">
                  <label>Lote</label>
                  <input
                    name="lotCode"
                    value={addForm.lotCode}
                    onChange={handleAddChange}
                    placeholder="Código de lote"
                    maxLength={64}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de expiración</label>
                  <input
                    type="date"
                    name="expires"
                    value={addForm.expires}
                    onChange={handleAddChange}
                  />
                </div>
                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                  <label>Descripción</label>
                  <input
                    name="medicationDescription"
                    value={addForm.medicationDescription}
                    onChange={handleAddChange}
                    placeholder="Opcional"
                    maxLength={2000}
                  />
                </div>
                <div className="form-actions" style={{gridColumn: '1 / -1'}}>
                  <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)} disabled={saving}>Cancelar</button>
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editingId !== null && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 style={{marginBottom: 16}}>Editar medicamento</h2>
              <form onSubmit={handleEditSubmit} className="medication-form-grid">
                <div className="form-group">
                  <label>Cantidad</label>
                  <input
                    name="quantity"
                    type="number"
                    min="0"
                    value={editForm.quantity}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unidad</label>
                  <input
                    name="unit"
                    value={editForm.unit}
                    onChange={handleEditChange}
                    maxLength={16}
                  />
                </div>
                <div className="form-group">
                  <label>Lote</label>
                  <input
                    name="lotCode"
                    value={editForm.lotCode}
                    onChange={handleEditChange}
                    maxLength={64}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de expiración</label>
                  <input
                    type="date"
                    name="expires"
                    value={editForm.expires}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-actions" style={{gridColumn: '1 / -1'}}>
                  <button type="button" className="btn-secondary" onClick={() => setEditingId(null)} disabled={saving}>Cancelar</button>
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;