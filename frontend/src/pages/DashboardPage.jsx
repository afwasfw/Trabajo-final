import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const DashboardPage = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Bienvenido al Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-outline-danger">
          <i className="bi bi-box-arrow-right me-2"></i>
          Cerrar Sesión
        </button>
      </div>
      <p className="lead">Has iniciado sesión correctamente.</p>
      
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-file-earmark-text display-4 text-primary"></i>
              <h5 className="card-title mt-3">Gestionar Trámites</h5>
              <p className="card-text">Visualiza, crea y administra todos los trámites del sistema.</p>
              <Link to="/tramites" className="btn btn-primary">
                Ir a Trámites
              </Link>
            </div>
          </div>
        </div>
        {/* Aquí podrías agregar más tarjetas para otras secciones */}
      </div>
    </div>
  );
};

export default DashboardPage;
