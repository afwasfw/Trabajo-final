import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
// import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- 1. ELIMINAR ESTA LÍNEA
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
// const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // <-- 2. ELIMINAR ESTA LÍNEA

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. ELIMINAR EL ENVOLTORIO DE GoogleOAuthProvider */}
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <App />
    </GoogleReCaptchaProvider>
  </React.StrictMode>,
);
