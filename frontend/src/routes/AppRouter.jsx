import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importa tus páginas
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import TramitesPage from '../pages/TramitesPage';
import NuevoTramitePage from '../pages/NuevoTramitePage';
import RegistroPage from '../pages/RegistroPage'; // <-- 1. Importa la nueva página

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
      </Routes>
    </Router>
  );
};

export default AppRouter;

