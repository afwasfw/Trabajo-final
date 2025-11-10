import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { auth, googleProvider } from '../config/firebase'; // 1. Importar de Firebase
import { signInWithPopup } from "firebase/auth"; // 2. Importar función de login

const pageStyle = {
  background: 'linear-gradient(to right, #ece9e6, #ffffff)',
  padding: '2rem 0'
};

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verContrasena, setVerContrasena] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth(); // 3. Obtener la nueva función del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo || !contrasena) {
      Swal.fire({ icon: 'warning', title: 'Campos Incompletos', text: 'Por favor, ingrese su correo y contraseña.' });
      return;
    }
    setLoading(true);
    const exito = await login(correo, contrasena);
    setLoading(false);
    if (exito) navigate('/');
    else Swal.fire({ icon: 'error', title: 'Error de Autenticación', text: 'Credenciales inválidas.' });
  };

  // 4. Función para manejar el login con Google
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const exito = await loginWithGoogle(idToken);
      if (exito) {
        navigate('/');
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

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={pageStyle}>
      <div className="card shadow-lg border-0 rounded-3" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
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
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </div>
          </form>
          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="px-3 text-muted">o</span>
            <hr className="flex-grow-1" />
          </div>
          <div className="d-grid gap-2">
            {/* 5. Botón de Google funcional */}
            <button className="btn btn-outline-danger" onClick={handleGoogleLogin} disabled={googleLoading}>
              {googleLoading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-google me-2"></i>
              )}
              Continuar con Google
            </button>
            <button className="btn btn-outline-primary" disabled>
              <i className="bi bi-facebook me-2"></i> Continuar con Facebook
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
