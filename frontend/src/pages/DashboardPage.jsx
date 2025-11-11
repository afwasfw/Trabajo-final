import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axios';

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

const DashboardPage = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const resSolicitudes = await apiClient.get('/solicitudes/mis-solicitudes?limite=5');
        // CORRECCIÓN: Accedemos a la propiedad 'datos' anidada que contiene el array de solicitudes.
        setSolicitudes(resSolicitudes.data.datos.datos || []);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (usuario) {
      cargarDatos();
    } else {
      setLoading(false);
    }
  }, [usuario]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  return (
    <div className="dashboard-background"> {/* Esta clase ya está aplicada */}
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h1 className="h2 fw-bold text-primary">Bienvenido a tu Portal Ciudadano</h1>
            <p className="lead text-muted">Hola, <span className="fw-semibold">{usuario?.nombre || 'ciudadano'}</span>. Gestiona tus trámites de forma eficiente.</p>
          </div>
          {usuario && (
            <div className="d-flex align-items-center">
              {usuario.foto && <img src={usuario.foto} alt="Perfil" className="rounded-circle me-3 shadow-sm" style={{width: '50px', height: '50px', objectFit: 'cover'}} />}
              <button onClick={handleLogout} className="btn btn-outline-danger d-flex align-items-center">
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
        
        <div className="row mt-4">
          {/* Tarjeta para iniciar un nuevo trámite */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100 shadow-lg border-0 card-hover">
              <div className="card-body text-center d-flex flex-column justify-content-center p-4">
                <i className="bi bi-file-earmark-plus display-2 text-success mb-3"></i>
                <h5 className="card-title fw-bold text-success">Iniciar Nuevo Trámite</h5>
                <p className="card-text text-muted mb-4">Comienza un nuevo proceso administrativo de forma rápida y sencilla. Completa el formulario y adjunta tus documentos.</p>
                <Link to="/tramites/nuevo" className="btn btn-success btn-lg mt-auto stretched-link shadow-sm">
                  <i className="bi bi-folder-plus me-2"></i>
                  Registrar Solicitud
                </Link>
              </div>
            </div>
          </div>

          {/* Tarjeta para ver mis solicitudes recientes */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100 shadow-lg border-0">
              <div className="card-body d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h5 className="card-title fw-bold mb-0 text-primary">Mis Solicitudes Recientes</h5>
                  <Link to="/tramites" className="btn btn-sm btn-outline-primary">Ver Todas <i className="bi bi-arrow-right"></i></Link>
                </div>
                {solicitudes.length > 0 ? (
                  <div className="table-responsive mt-3">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Código</th>
                          <th scope="col">Trámite</th>
                          <th scope="col">Estado</th>
                          <th scope="col" className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {solicitudes.map(solicitud => (
                          <tr key={solicitud.id_solicitud}>
                            <td><span className="text-muted">{solicitud.codigo_seguimiento}</span></td>
                            <td>{solicitud.nombre_tramite}</td>
                            <td><EstadoBadge estado={solicitud.estado} /></td>
                            <td className="text-center">
                              <Link to={`/solicitudes/${solicitud.id_solicitud}`} className="btn btn-sm btn-outline-info" title="Ver Detalle">
                                <i className="bi bi-eye"></i>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted mt-3 flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                    <i className="bi bi-folder-x display-4 mb-3"></i>
                    <p className="fs-5">No tienes solicitudes recientes.</p>
                    <p>¡Anímate a iniciar tu primer trámite!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
