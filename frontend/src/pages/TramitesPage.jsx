import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';

const TramitesPage = () => {
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTramites = async () => {
      try {
        // Hacemos la petición al endpoint que definiste en el backend
        const response = await apiClient.get('/licencias');
        // La documentación del backend indica que la respuesta es un array
        setTramites(response.data || []);
      } catch (err) {
        setError('No se pudieron cargar los trámites. Por favor, intente más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTramites();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Gestión de Trámites</h1>
        <Link to="/tramites/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Trámite
        </Link>
      </div>
      
      <div className="card">
        <div className="card-body">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>ID Trámite</th>
                <th>Tipo de Licencia</th>
                <th>Estado</th>
                <th>Fecha de Solicitud</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramites.length > 0 ? (
                tramites.map((tramite) => (
                  <tr key={tramite.id_licencia}>
                    <td>{tramite.id_licencia}</td>
                    <td>{tramite.tipo_licencia}</td>
                    <td>
                      <span className={`badge bg-${tramite.estado === 'Aprobada' ? 'success' : 'warning'}`}>
                        {tramite.estado}
                      </span>
                    </td>
                    <td>{new Date(tramite.fecha_solicitud).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-info">
                        <i className="bi bi-eye"></i> Ver
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No hay trámites registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TramitesPage;
