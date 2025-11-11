import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import Footer from './pages/Footer'; // CORRECCIÓN: La ruta correcta es desde 'pages'

function App() {
  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <main style={{ flex: '1' }}>
          <AppRouter />
        </main>
        <Footer /> {/* 2. Añadir el Footer al final de la aplicación */}
      </div>
    </AuthProvider>
  );
}

export default App;
