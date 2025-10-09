import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../api/token';
import { useRouter } from 'next/router';

const Inventory = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [router]);

  // Datos mock de medicamentos
  const mockMedications = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      description: 'Analgésico y antipirético para el alivio del dolor y la fiebre',
      expirationDate: '2025-12-15',
      dateAdded: '2024-09-15'
    },
    {
      id: 2,
      name: 'Vitamina C',
      description: 'Suplemento vitamínico para fortalecer el sistema inmunológico',
      expirationDate: '2026-03-20',
      dateAdded: '2024-08-10'
    },
    {
      id: 3,
      name: 'Ibuprofeno 400mg',
      description: 'Antiinflamatorio no esteroideo para dolor y inflamación',
      expirationDate: '2025-11-30',
      dateAdded: '2024-07-22'
    },
    {
      id: 4,
      name: 'Omeprazol 20mg',
      description: 'Inhibidor de la bomba de protones para acidez estomacal',
      expirationDate: '2025-10-18',
      dateAdded: '2024-06-05'
    },
    {
      id: 5,
      name: 'Acetaminofén Infantil',
      description: 'Analgésico y antipirético formulado especialmente para niños',
      expirationDate: '2025-08-25',
      dateAdded: '2024-09-01'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isExpiringSoon = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isExpired = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    return expDate < today;
  };

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
        </div>

        {/* Tabla de medicamentos */}
        <div className="medications-table-container">
          <table className="medications-table">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Descripción</th>
                <th>Fecha de Expiración</th>
                <th>Fecha de Adición</th>
              </tr>
            </thead>
            <tbody>
              {mockMedications.map((medication) => (
                <tr 
                  key={medication.id}
                  className={`
                    ${isExpired(medication.expirationDate) ? 'expired' : ''}
                    ${isExpiringSoon(medication.expirationDate) ? 'expiring-soon' : ''}
                  `}
                >
                  <td className="medication-name">
                    {medication.name}
                    {isExpired(medication.expirationDate) && (
                      <span className="status-badge expired-badge">Vencido</span>
                    )}
                    {isExpiringSoon(medication.expirationDate) && !isExpired(medication.expirationDate) && (
                      <span className="status-badge warning-badge">Por vencer</span>
                    )}
                  </td>
                  <td className="medication-description">{medication.description}</td>
                  <td className="expiration-date">{formatDate(medication.expirationDate)}</td>
                  <td className="date-added">{formatDate(medication.dateAdded)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen */}
        <div className="inventory-summary">
          <div className="summary-item">
            <span className="summary-number">{mockMedications.length}</span>
            <span className="summary-label">Total de medicamentos</span>
          </div>
          <div className="summary-item warning">
            <span className="summary-number">
              {mockMedications.filter(m => isExpiringSoon(m.expirationDate) && !isExpired(m.expirationDate)).length}
            </span>
            <span className="summary-label">Por vencer (30 días)</span>
          </div>
          <div className="summary-item danger">
            <span className="summary-number">
              {mockMedications.filter(m => isExpired(m.expirationDate)).length}
            </span>
            <span className="summary-label">Vencidos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;