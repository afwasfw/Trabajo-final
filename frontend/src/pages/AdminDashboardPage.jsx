import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import Swal from 'sweetalert2';

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

const PrioridadBadge = ({ prioridad }) => {
  const colores = {
    'Alta': 'danger',
    'Media': 'warning',
    'Baja': 'info',
  };
  const color = colores[prioridad] || 'secondary';
  return <span className={`badge bg-${color} text-uppercase fw-bold`}>{prioridad}</span>;
};

const AdminDashboardPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchSolicitudes = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/admin/solicitudes?pagina=${paginaActual}&busqueda=${busqueda}`);
        setSolicitudes(response.data.datos.datos || []);
        const { total, limite } = response.data.datos.paginacion;
        setTotalPaginas(Math.ceil(total / limite));
      } catch (err) {
        setError('No se pudieron cargar las solicitudes. Es posible que no tengas los permisos necesarios.');
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar las solicitudes.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [paginaActual, busqueda]);

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h1 className="h2 fw-bold text-primary">Panel de Administración de Solicitudes</h1>
      </div>
      
      <div className="card shadow-lg border-0">
        <div className="card-header bg-light p-3">
          <div className="input-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar por código, trámite o ciudadano..."
              onBlur={(e) => setBusqueda(e.target.value)}
              onKeyUp={(e) => { if (e.key === 'Enter') setBusqueda(e.target.value) }}
            />
            <span className="input-group-text"><i className="bi bi-search"></i></span>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Trámite</th>
                  <th scope="col">Ciudadano</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Prioridad (IA)</th>
                  <th scope="col">Fecha</th>
                  <th scope="col" className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.length > 0 ? (
                  solicitudes.map(solicitud => (
                    <tr key={solicitud.id_solicitud}>
                      <td><span className="text-muted">{solicitud.codigo_seguimiento}</span></td>
                      <td>{solicitud.nombre_tramite}</td>
                      <td>{solicitud.nombre_usuario}</td>
                      <td><EstadoBadge estado={solicitud.estado} /></td>
                      <td><PrioridadBadge prioridad={solicitud.prioridad_calculada} /></td>
                      <td>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
                      <td className="text-center">
                        <Link to={`/solicitudes/${solicitud.id_solicitud}`} className="btn btn-sm btn-outline-info" title="Ver Detalle">
                          <i className="bi bi-eye"></i>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-5">
                      <i className="bi bi-search display-4 mb-3"></i>
                      <p className="fs-5">No se encontraron solicitudes.</p>
                      <p>Intenta con otra búsqueda o espera a que lleguen nuevas solicitudes.</p>
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

export default AdminDashboardPage;