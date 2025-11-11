import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import Swal from 'sweetalert2';

// Componente para el estado del trámite con colores
const EstadoBadge = ({ estado }) => {
  const colores = {
    'En revisión': 'warning',
    'Aprobado': 'success',
    'Observado': 'danger',
    'Finalizado': 'primary',
    'Rechazado': 'dark',
  };
  const color = colores[estado] || 'secondary';
  return <span className={`badge bg-${color} text-uppercase fw-bold`}>{estado}</span>;
};

const TramitesPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Nuevos estados para paginación y búsqueda
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchSolicitudes = async () => {
      setLoading(true);
      try {
        // Petición con parámetros de paginación y búsqueda
        const response = await apiClient.get(`/solicitudes/mis-solicitudes?pagina=${paginaActual}&busqueda=${busqueda}`);
        setSolicitudes(response.data.datos.datos || []); // CORRECCIÓN: Acceder a response.data.datos.datos
        const { total, limite } = response.data.datos.paginacion; // CORRECCIÓN: Acceder a response.data.datos.paginacion
        setTotalPaginas(Math.ceil(total / limite));
      } catch (err) {
        setError('No se pudieron cargar tus solicitudes. Por favor, intente más tarde.');
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar tus solicitudes.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [paginaActual, busqueda]); // Se ejecuta de nuevo si cambia la página o la búsqueda

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h1 className="h2 fw-bold text-primary mb-0">Mis Solicitudes</h1>
        <div className="d-flex">
          <Link to="/dashboard" className="btn btn-outline-secondary d-flex align-items-center me-2">
            <i className="bi bi-arrow-left me-2"></i>Volver al Dashboard
          </Link>
          <Link to="/tramites/nuevo" className="btn btn-success d-flex align-items-center shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Iniciar Nuevo Trámite
          </Link>
        </div>
      </div>
      
      <div className="card shadow-lg border-0">
        <div className="card-header bg-light p-3">
          <div className="input-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar por código o nombre de trámite..."
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="input-group-text"><i className="bi bi-search"></i></span>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Código de Seguimiento</th>
                  <th scope="col">Nombre del Trámite</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Fecha de Solicitud</th>
                  <th scope="col" className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.length > 0 ? (
                  solicitudes.map((solicitud) => (
                    <tr key={solicitud.id_solicitud}>
                      <td><span className="text-muted">{solicitud.codigo_seguimiento}</span></td>
                      <td>{solicitud.nombre_tramite}</td>
                      <td><EstadoBadge estado={solicitud.estado} /></td>
                      <td>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
                      <td className="text-center">
                        <Link to={`/solicitudes/${solicitud.id_solicitud}`} className="btn btn-sm btn-outline-info" title="Ver Detalle">
                          <i className="bi bi-eye"></i> Ver
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                      <i className="bi bi-search display-4 mb-3"></i>
                      <p className="fs-5">No se encontraron solicitudes.</p>
                      <p>Intenta con otra búsqueda o inicia un nuevo trámite.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {totalPaginas > 1 && (
          <div className="card-footer d-flex justify-content-center">
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>Anterior</button>
                </li>
                {/* Aquí se podrían generar los números de página, pero por simplicidad solo mostramos el actual */}
                <li className="page-item active"><span className="page-link">{paginaActual} de {totalPaginas}</span></li>
                <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default TramitesPage;
