import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { usuario } = useAuth();

  // Si el usuario existe y su rol es 'Administrador', permite el acceso.
  if (usuario && usuario.rol_nombre === 'Administrador') {
    return children;
  }

  // Si no, redirige al dashboard de ciudadano.
  return <Navigate to="/dashboard" />;
};

export default AdminRoute;