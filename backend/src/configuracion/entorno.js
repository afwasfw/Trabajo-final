// src/configuracion/entorno.js
import dotenv from 'dotenv';

dotenv.config();

const requerido = (valor, nombre) => {
  if (valor === null || valor === undefined) {
    throw new Error(`Falta la variable de entorno requerida: ${nombre}`);
  }
  return valor;
};

export const entorno = {
  puerto: process.env.PUERTO || 4000,
  db: {
    host: requerido(process.env.DB_HOST, 'DB_HOST'),
    user: requerido(process.env.DB_USER, 'DB_USER'),
    pass: requerido(process.env.DB_PASS, 'DB_PASS'),
    name: requerido(process.env.DB_NAME, 'DB_NAME'),
    port: process.env.DB_PORT || 3306
  },
  jwt: {
    secreto: requerido(process.env.JWT_SECRETO, 'JWT_SECRETO'),
    expiracion: process.env.JWT_EXP || '12h'
  },
  recaptcha: { // Sección añadida para reCAPTCHA
    secreto: requerido(process.env.RECAPTCHA_SECRET_KEY, 'RECAPTCHA_SECRET_KEY')
  },

  firebase: { // Añadir esta sección
    serviceAccount: requerido(process.env.FIREBASE_SERVICE_ACCOUNT, 'FIREBASE_SERVICE_ACCOUNT')
  },
  correo: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    puerto: process.env.SMTP_PORT || 587,
    usuario: process.env.SMTP_USER,
    clave: process.env.SMTP_PASS
  }
};

