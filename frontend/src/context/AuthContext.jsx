import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        setUsuario(decodedUser);
      } catch (error) {
        localStorage.removeItem('token');
        setToken(null);
        setUsuario(null);
      }
    }
  }, []);

  const login = async (correo, contrasena) => {
    try {
      const response = await apiClient.post('/usuarios/login', { correo, contrasena });
      const responseData = response.data.datos;
      if (responseData && responseData.token) {
        const responseToken = responseData.token;
        localStorage.setItem('token', responseToken);
        setToken(responseToken);
        const decodedUser = jwtDecode(responseToken);
        setUsuario(decodedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.response?.data?.mensaje || error.message);
      return false;
    }
  };

  // --- INICIO: NUEVA FUNCIÓN PARA LOGIN CON GOOGLE ---
  const loginWithGoogle = async (idToken) => {
    try {
      // Enviamos el token de Google a nuestro backend
      const response = await apiClient.post('/usuarios/login/google', { idToken });
      const responseData = response.data.datos;

      if (responseData && responseData.token) {
        const responseToken = responseData.token; // Este es NUESTRO token JWT
        localStorage.setItem('token', responseToken);
        setToken(responseToken);
        const decodedUser = jwtDecode(responseToken);
        setUsuario(decodedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en el inicio de sesión con Google (backend):', error.response?.data?.mensaje || error.message);
      return false;
    }
  };
  // --- FIN: NUEVA FUNCIÓN ---

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = { usuario, token, login, logout, loginWithGoogle }; // Añadir la nueva función al contexto

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
