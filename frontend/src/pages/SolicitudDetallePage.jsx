import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const SolicitudDetallePage = () => {
  const { id } = useParams();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitud = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/solicitudes/${id}`);
        const datos = response.data.datos;
        datos.datos_especificos = JSON.parse(datos.datos_especificos || '{}');
        setSolicitud(datos);
      } catch (error) {
        console.error("Error al cargar la solicitud:", error);
        Swal.fire('Error', 'No se pudo cargar el detalle de la solicitud.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [id]);

  const handleDownload = async (idDocumento, nombreDoc) => {
    try {
      const response = await apiClient.get(`/documentos/${idDocumento}/descargar`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nombreDoc);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire('Error', 'No se pudo descargar el documento. Verifique sus permisos.', 'error');
      console.error('Error al descargar el documento:', error);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary"></div></div>;
  }

  if (!solicitud) {
    return <div className="container mt-5 alert alert-danger text-center">
      <h4 className="alert-heading">Solicitud no encontrada</h4>
      <p>La solicitud que buscas no existe o no tienes permiso para verla.</p>
      <Link to="/tramites" className="btn btn-primary">Volver a Mis Solicitudes</Link>
    </div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h1 className="h2 fw-bold text-primary">Detalle de la Solicitud</h1>
        <Link to="/tramites" className="btn btn-secondary d-flex align-items-center">
          <i className="bi bi-arrow-left me-2"></i>
          Volver a Mis Solicitudes
        </Link>
      </div>

      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center p-3">
          <div>
            <small className="text-white-50">Código de Seguimiento</small>
            <h5 className="mb-0 fw-bold">{solicitud.codigo_seguimiento}</h5>
          </div>
          <div className="text-end">
            <small className="text-white-50">Fecha de Solicitud</small>
            <p className="mb-0 fw-bold">{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="card-body p-4">
          <h4 className="card-title fw-bold text-info mb-3">{solicitud.nombre_tramite}</h4>
          <p className="card-text text-muted mb-4">{solicitud.descripcion_tramite}</p>
          <div className="mb-4">
            <span className="me-3 fs-5"><strong>Estado Actual:</strong> <EstadoBadge estado={solicitud.estado} /></span>
          </div>
          
          <hr className="my-4" />

          {/* Datos Específicos */}
          <h5 className="mb-3 fw-bold text-secondary">Datos Proporcionados</h5>
          {Object.keys(solicitud.datos_especificos).length > 0 ? (
            <ul className="list-group list-group-flush mb-4 border rounded">
              {Object.entries(solicitud.datos_especificos).map(([key, value]) => (
                <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
                  <strong className="text-capitalize">{key.replace(/_/g, ' ')}:</strong>
                  <span className="text-end">{value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted fst-italic">No se proporcionaron datos adicionales para este trámite.</p>
          )}

          <hr className="my-4" />

          {/* Documentos Adjuntos */}
          <h5 className="mb-3 fw-bold text-secondary">Documentos Adjuntos</h5>
          {solicitud.documentos && solicitud.documentos.length > 0 ? (
            <ul className="list-group mb-4 border rounded">
              {solicitud.documentos.map(doc => (
                <li key={doc.id_documento} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    <i className="bi bi-file-earmark-arrow-down-fill me-2 text-primary"></i>
                    {doc.nombre_doc}
                  </span>
                  <button onClick={() => handleDownload(doc.id_documento, doc.nombre_doc)} className="btn btn-sm btn-outline-primary d-flex align-items-center">
                    <i className="bi bi-download me-1"></i> Descargar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted fst-italic">No se adjuntaron documentos para esta solicitud.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolicitudDetallePage;
