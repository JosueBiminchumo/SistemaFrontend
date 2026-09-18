import React, { useState, useEffect } from 'react';
import { getUsers, getDoctors, getPatients, deleteUser } from '../services/adminService';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let result = [];
      if (activeTab === 'usuarios') {
        result = await getUsers();
      } else if (activeTab === 'medicos') {
        result = await getDoctors();
      } else if (activeTab === 'pacientes') {
        result = await getPatients();
      }
      setData(result);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id) => {
    if (activeTab === 'usuarios' && window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await deleteUser(id);
        fetchData();
      } catch (err) {
        alert('Error al eliminar');
      }
    } else {
      alert('La eliminación directa solo está habilitada para la sección de usuarios.');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '16px' }}>Panel de Administración (MED-26)</h2>

      {/* Pestañas de navegación */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('usuarios')}
          style={{ padding: '8px 16px', background: activeTab === 'usuarios' ? '#007bff' : '#f0f0f0', color: activeTab === 'usuarios' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Usuarios
        </button>
        <button 
          onClick={() => setActiveTab('medicos')}
          style={{ padding: '8px 16px', background: activeTab === 'medicos' ? '#007bff' : '#f0f0f0', color: activeTab === 'medicos' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Médicos
        </button>
        <button 
          onClick={() => setActiveTab('pacientes')}
          style={{ padding: '8px 16px', background: activeTab === 'pacientes' ? '#007bff' : '#f0f0f0', color: activeTab === 'pacientes' ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Pacientes
        </button>
      </div>

      {/* Mensajes de estado */}
      {loading && <p>Cargando registros...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Tabla de resultados */}
      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Nombre / Usuario</th>
                <th style={{ padding: '12px' }}>Correo / Detalle</th>
                <th style={{ padding: '12px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id || index} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{item.id || index + 1}</td>
                    <td style={{ padding: '12px' }}>{item.nombre || item.username || 'N/D'}</td>
                    <td style={{ padding: '12px' }}>{item.correo || item.email || item.especialidad || 'N/D'}</td>
                    <td style={{ padding: '12px' }}>
                      {activeTab === 'usuarios' && (
                        <button 
                          onClick={() => handleDelete(item.id)}
                          style={{ padding: '6px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                    No hay registros encontrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}