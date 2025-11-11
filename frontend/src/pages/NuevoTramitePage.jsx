import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import DatePicker from 'react-datepicker'; // Solo necesitamos esta librería
import Swal from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';

const NuevoTramitePage = () => {
  // Estado para la lista de trámites disponibles del catálogo
  const [catalogo, setCatalogo] = useState([]);
  
  // Estado para el trámite seleccionado por el usuario
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);
  
  // Estado para los datos específicos que el usuario llenará (tipo 'info')
  const [datosEspecificos, setDatosEspecificos] = useState({});
  
  // Estado para los archivos que el usuario subirá (tipo 'doc')
  const [archivos, setArchivos] = useState({});

  // Estado para la fecha y hora del evento (si el trámite lo requiere)
  const [fechaEvento, setFechaEvento] = useState(new Date());

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Cargar el catálogo de trámites al montar el componente
  useEffect(() => {
    const fetchCatalogo = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/catalogo');
        // Asegurarnos de que los requisitos vengan como JSON parseado
        const catalogoParseado = response.data.datos.map(t => ({
          ...t,
          requisitos: typeof t.requisitos === 'string' ? JSON.parse(t.requisitos) : t.requisitos || []
        }));
        setCatalogo(catalogoParseado);
      } catch (err) {
        setError('No se pudo cargar la lista de trámites disponibles.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogo();
  }, []);

  // 2. Manejar el cambio en la selección del trámite
  const handleTramiteChange = (e) => {
    const idSeleccionado = e.target.value;
    const tramite = catalogo.find(t => t.id_catalogo.toString() === idSeleccionado);
    setTramiteSeleccionado(tramite);
    
    // Reiniciar los datos al cambiar de trámite
    setDatosEspecificos({});
    setArchivos({});
    setFechaEvento(new Date()); // Resetear la fecha al cambiar de trámite
  };

  // 3. Manejar el cambio en los campos de texto (tipo 'info')
  const handleDatosChange = (e) => {
    const { name, value } = e.target;
    setDatosEspecificos(prev => ({ ...prev, [name]: value }));
  };

  // 4. Manejar el cambio en los campos de archivo (tipo 'doc')
  const handleArchivoChange = (e) => {
    const { name, files } = e.target;
    setArchivos(prev => ({ ...prev, [name]: files[0] }));
  };

  // 5. Manejar el cambio en la fecha y hora
  const handleFechaEventoChange = (date) => {
    setFechaEvento(date);
  };

  // 5. Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tramiteSeleccionado) {
      Swal.fire('Atención', 'Debe seleccionar un tipo de trámite.', 'warning');
      return;
    }

    setLoading(true);
    setError('');

    // Usamos FormData para poder enviar archivos y datos de texto juntos
    const formData = new FormData();
    formData.append('id_catalogo', tramiteSeleccionado.id_catalogo);
    formData.append('datos_especificos', JSON.stringify(datosEspecificos));

    // Añadir la fecha y hora del evento al FormData (si es necesario)
    formData.append('fecha_evento', fechaEvento.toISOString());

    // Adjuntar todos los archivos
    Object.keys(archivos).forEach(key => {
      if (archivos[key]) {
        formData.append(key, archivos[key]);
      }
    });

    try {
      // El endpoint POST /solicitudes debe estar preparado para recibir 'multipart/form-data'
      await apiClient.post('/solicitudes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        icon: 'success',
        title: '¡Solicitud Registrada!',
        text: 'Tu trámite ha sido iniciado exitosamente.',
        timer: 2500,
        showConfirmButton: false,
      });
      navigate('/dashboard'); // Redirigir al dashboard
    } catch (err) {
      const mensajeError = err.response?.data?.mensaje || 'Error al registrar la solicitud.';
      Swal.fire('Error', mensajeError, 'error');
      setError(mensajeError);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Memoizamos los requisitos para no recalcularlos en cada render
  const requisitosDelTramite = useMemo(() => {
    return tramiteSeleccionado?.requisitos || [];
  }, [tramiteSeleccionado]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Registrar Nueva Solicitud</h1>
        <Link to="/dashboard" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Volver al Dashboard
        </Link>
      </div>

      <div className="card">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* SECCIÓN 1: SELECCIÓN DEL TRÁMITE */}
            <div className="mb-4">
              <label htmlFor="catalogo-select" className="form-label fs-5">1. Seleccione el tipo de trámite</label>
              <select 
                id="catalogo-select" 
                className="form-select form-select-lg" 
                onChange={handleTramiteChange}
                defaultValue=""
                required
              >
                <option value="" disabled>-- Elija un trámite --</option>
                {catalogo.map(t => (
                  <option key={t.id_catalogo} value={t.id_catalogo}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* SECCIÓN 2: CAMPOS DINÁMICOS */}
            {tramiteSeleccionado && requisitosDelTramite.length > 0 && (
              <div>
                <h5 className="mb-3">2. Complete los datos y adjunte los documentos requeridos</h5>
                <p className="text-muted">{tramiteSeleccionado.descripcion}</p>
                
                {requisitosDelTramite.map(req => (
                  <div key={req.id} className="mb-3">
                    <label htmlFor={req.id} className="form-label">{req.label}</label>
                    {req.tipo === 'info' && (
                      <input
                        style={{fontSize:"1.1em"}}
                        type="text"
                        className="form-control"
                        id={req.id}
                        name={req.id}
                        value={datosEspecificos[req.id] || ''}
                        onChange={handleDatosChange}
                        required
                      />
                    )}
                    {req.tipo === 'doc' && (
                      <div className="input-group">
                        <input
                          style={{fontSize:"1.1em"}}
                          type="file"
                          className="form-control"
                          id={req.id}
                          name={req.id}
                          onChange={handleArchivoChange}
                          required
                        />
                        {archivos[req.id] && (
                           <span className="input-group-text text-success">
                             <i className="bi bi-check-circle-fill"></i>
                           </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Ejemplo: Selector de fecha y hora para 'Permiso para Evento Temporal' */}
                {tramiteSeleccionado?.nombre === 'Permiso para Evento Temporal' && (
                  <div className="mb-3">
                    <label className="form-label">Fecha y Hora del Evento</label>
                    <DatePicker
                      selected={fechaEvento}
                      onChange={handleFechaEventoChange}
                      showTimeSelect
                      dateFormat="dd/MM/yyyy hh:mm aa"
                      className="form-control"
                    />
                  </div>
                )}

              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !tramiteSeleccionado}>
                {loading ? 'Enviando Solicitud...' : 'Iniciar Trámite'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoTramitePage;
