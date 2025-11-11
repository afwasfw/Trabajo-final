import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importa tus páginas
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import TramitesPage from '../pages/TramitesPage';
import NuevoTramitePage from '../pages/NuevoTramitePage';
import SolicitudDetallePage from '../pages/SolicitudDetallePage';
import RegistroPage from '../pages/RegistroPage';
import AdminDashboardPage from '../pages/AdminDashboardPage'; // 1. Importar la página de admin
import AdminRoute from './AdminRoute'; // CORRECCIÓN: La ruta correcta es desde la misma carpeta 'routes'

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} /> {/* <-- 2. Añade la nueva ruta */}
        
        {/* Rutas Protegidas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tramites" 
          element={
            <ProtectedRoute>
              <TramitesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tramites/nuevo" 
          element={
            <ProtectedRoute>
              <NuevoTramitePage />
            </ProtectedRoute>
          } 
        />
        {/* 2. Añadir la nueva ruta para el detalle de la solicitud */}
        <Route 
          path="/solicitudes/:id" 
          element={
            <ProtectedRoute>
              <SolicitudDetallePage />
            </ProtectedRoute>
          } 
        />

        {/* Ruta para el Panel de Administrador */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
