import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import Swal from 'sweetalert2';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import '../styles/Auth.css'; // 1. Importar los nuevos estilos

const RegistroPage = () => {
  const [formData, setFormData] = useState({
    nombre: '', dni: '', correo: '', contrasena: '', telefono: '', direccion: '', rol_nombre: 'Ciudadano'
  });
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [verContrasena, setVerContrasena] = useState(false);
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const validarCampo = (name, value) => {
    let errorMsg = '';
    if (!value && (name === 'nombre' || name === 'dni' || name === 'correo' || name === 'contrasena')) {
      errorMsg = 'Este campo es obligatorio.';
    } else if (name === 'correo' && value && !/\S+@\S+\.\S+/.test(value)) {
      errorMsg = 'El formato del correo no es válido.';
    } else if (name === 'dni' && value && !/^\d{8}$/.test(value)) {
      errorMsg = 'El DNI debe tener 8 dígitos.';
    } else if (name === 'contrasena' && value && value.length < 8) {
      errorMsg = 'La contraseña debe tener al menos 8 caracteres.';
    }
    setErrores(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    if (errores[name]) {
      validarCampo(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validarCampo(name, value);
  };

  const fortalezaContrasena = useMemo(() => {
    const pass = formData.contrasena;
    let puntaje = 0;
    if (pass.length >= 8) puntaje++;
    if (/[A-Z]/.test(pass)) puntaje++;
    if (/[0-9]/.test(pass)) puntaje++;
    if (/[^A-Za-z0-9]/.test(pass)) puntaje++;
    return puntaje;
  }, [formData.contrasena]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const camposRequeridos = ['nombre', 'dni', 'correo', 'contrasena'];
    let hayErrores = false;
    camposRequeridos.forEach(campo => {
      validarCampo(campo, formData[campo]);
      if (!formData[campo] || errores[campo]) hayErrores = true;
    });

    if (hayErrores) {
      Swal.fire({ icon: 'warning', title: 'Campos incompletos o inválidos', text: 'Por favor, revise los datos del formulario.' });
      return;
    }
    if (!executeRecaptcha) {
      Swal.fire({ icon: 'error', title: 'Error de reCAPTCHA', text: 'No se pudo cargar el script de verificación. Por favor, recargue la página.' });
      return;
    }

    setLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha('registroUsuario');
      const dataToSend = { ...formData, recaptchaToken };

      await apiClient.post('/usuarios/registro', dataToSend);
      Swal.fire({
        icon: 'success', title: '¡Registro Exitoso!', text: 'Tu cuenta ha sido creada. Ahora serás redirigido para iniciar sesión.', timer: 2500, showConfirmButton: false
      }).then(() => navigate('/login'));
    } catch (err) {
      const mensajeError = err.response?.data?.mensaje || 'Error al registrar el usuario.';
      Swal.fire({ icon: 'error', title: 'Error en el Registro', text: mensajeError });
    } finally {
      setLoading(false);
    }
  };

  const coloresFortaleza = ['danger', 'warning', 'info', 'success'];
  const textosFortaleza = ['Muy Débil', 'Media', 'Buena', 'Fuerte'];

  return (
    // 2. Aplicar la clase para la imagen de fondo
    <div className="d-flex align-items-center justify-content-center min-vh-100 auth-container">
      {/* 3. Aplicar la clase para el efecto de transición y añadir position-relative */}
      <div className="card shadow-lg border-0 rounded-3 auth-card position-relative" style={{ width: '100%', maxWidth: '700px' }}>
        
        {/* 4. Añadir el overlay de carga */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 mb-0">Creando cuenta...</p>
          </div>
        )}

        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <i className="bi bi-person-plus-fill display-4 text-primary"></i>
            <h3 className="card-title mt-3">Crear Cuenta</h3>
            <p className="text-muted">Completa tus datos para acceder al portal.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            {/* ... (el resto del formulario no cambia) ... */}
            <div className="form-floating mb-3">
              <input type="text" className={`form-control ${errores.nombre ? 'is-invalid' : ''}`} id="nombre" name="nombre" placeholder="Nombre Completo" onChange={handleChange} onBlur={handleBlur} required />
              <label htmlFor="nombre">Nombre Completo</label>
              {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="form-floating">
                  <input type="text" className={`form-control ${errores.dni ? 'is-invalid' : ''}`} id="dni" name="dni" placeholder="DNI" onChange={handleChange} onBlur={handleBlur} required />
                  <label htmlFor="dni">DNI</label>
                  {errores.dni && <div className="invalid-feedback">{errores.dni}</div>}
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="form-floating">
                  <input type="tel" className="form-control" id="telefono" name="telefono" placeholder="Teléfono" onChange={handleChange} />
                  <label htmlFor="telefono">Teléfono (Opcional)</label>
                </div>
              </div>
            </div>
            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="direccion" name="direccion" placeholder="Dirección" onChange={handleChange} />
              <label htmlFor="direccion">Dirección (Opcional)</label>
            </div>
            <hr className="my-4" />
            <div className="form-floating mb-3">
              <input type="email" className={`form-control ${errores.correo ? 'is-invalid' : ''}`} id="correo" name="correo" placeholder="correo@ejemplo.com" onChange={handleChange} onBlur={handleBlur} required />
              <label htmlFor="correo">Correo Electrónico</label>
              {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
            </div>
            <div className="input-group mb-1">
              <div className="form-floating">
                <input type={verContrasena ? 'text' : 'password'} className={`form-control ${errores.contrasena ? 'is-invalid' : ''}`} id="contrasena" name="contrasena" placeholder="Contraseña" onChange={handleChange} onBlur={handleBlur} required />
                <label htmlFor="contrasena">Contraseña</label>
                {errores.contrasena && <div className="invalid-feedback">{errores.contrasena}</div>}
              </div>
              <button className="btn btn-outline-secondary" type="button" onClick={() => setVerContrasena(!verContrasena)}>
                <i className={`bi ${verContrasena ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
            </div>
            {formData.contrasena && (
              <div className="mt-1">
                <div className="progress" style={{ height: '6px' }}>
                  <div className={`progress-bar bg-${coloresFortaleza[fortalezaContrasena - 1] || 'light'}`} role="progressbar" style={{ width: `${fortalezaContrasena * 25}%` }}></div>
                </div>
                <small className={`text-${coloresFortaleza[fortalezaContrasena - 1] || 'muted'}`}>
                  Fortaleza: {textosFortaleza[fortalezaContrasena - 1] || 'Muy Débil'}
                </small>
              </div>
            )}
            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                Crear Cuenta
              </button>
            </div>
            <div className="text-center mt-4">
              <p className="mb-0 text-muted">¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión aquí</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroPage;
