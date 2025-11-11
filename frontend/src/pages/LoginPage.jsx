import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from "firebase/auth";
import '../styles/Auth.css'; // 1. Importar los nuevos estilos

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verContrasena, setVerContrasena] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo || !contrasena) {
      Swal.fire({ icon: 'warning', title: 'Campos Incompletos', text: 'Por favor, ingrese su correo y contraseña.' });
      return;
    }
    setLoading(true);
    const rutaDestino = await login(correo, contrasena);
    setLoading(false);
    if (rutaDestino) navigate(rutaDestino);
    else Swal.fire({ icon: 'error', title: 'Error de Autenticación', text: 'Credenciales inválidas o problema del servidor.' });
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const rutaDestino = await loginWithGoogle(idToken);
      if (rutaDestino) {
        navigate(rutaDestino);
      } else {
        Swal.fire({ icon: 'error', title: 'Error de Servidor', text: 'No se pudo completar el inicio de sesión con Google.' });
      }
    } catch (error) {
      console.error("Error en el inicio de sesión con Google:", error);
      Swal.fire({ icon: 'error', title: 'Error de Google', text: 'No se pudo iniciar sesión con Google.' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const isLoading = loading || googleLoading;

  return (
    // 2. Aplicar la clase para la imagen de fondo
    <div className="d-flex align-items-center justify-content-center min-vh-100 auth-container">
      {/* 3. Aplicar la clase para el efecto de transición y añadir position-relative */}
      <div className="card shadow-lg border-0 rounded-3 auth-card position-relative" style={{ width: '100%', maxWidth: '420px' }}>
        
        {/* 4. Añadir el overlay de carga */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 mb-0">Procesando...</p>
          </div>
        )}

        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            {/* Aquí puedes poner el logo de la municipalidad */}
            {/* <img src="/path/to/logo.png" alt="Logo Municipalidad" style={{ height: '60px', marginBottom: '1rem' }} /> */}
            <i className="bi bi-buildings-fill display-4 text-primary"></i>
            <h3 className="card-title mt-3">Portal Municipal</h3>
            <p className="text-muted">Bienvenido de nuevo</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-floating mb-3">
              <input type="email" className="form-control" id="emailInput" placeholder="correo@ejemplo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              <label htmlFor="emailInput">Correo Electrónico</label>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <input type={verContrasena ? 'text' : 'password'} className="form-control" id="passwordInput" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                <label htmlFor="passwordInput">Contraseña</label>
              </div>
              <button className="btn btn-outline-secondary" type="button" onClick={() => setVerContrasena(!verContrasena)} title={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                <i className={`bi ${verContrasena ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
            </div>
            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                Ingresar
              </button>
            </div>
          </form>
          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="px-3 text-muted">o</span>
            <hr className="flex-grow-1" />
          </div>
          <div className="d-grid gap-2">
            <button className="btn btn-outline-danger" onClick={handleGoogleLogin} disabled={isLoading}>
              <i className="bi bi-google me-2"></i>
              Continuar con Google
            </button>
          </div>
          <div className="text-center mt-4">
            <p className="mb-0 text-muted">¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
