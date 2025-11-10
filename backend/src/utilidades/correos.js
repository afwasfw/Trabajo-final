// src/utilidades/correos.js
import nodemailer from 'nodemailer';
import { entorno } from '../configuracion/entorno.js';

const transporte = nodemailer.createTransport({
  host: entorno.correo.host,
  port: entorno.correo.puerto,
  secure: false,
  auth: {
    user: entorno.correo.usuario,
    pass: entorno.correo.clave
  }
});

export async function enviarCorreoLicencia(destinatario, codigo) {
  const opciones = {
    from: `Municipalidad <${entorno.correo.usuario}>`,
    to: destinatario,
    subject: 'Registro de licencia recibido',
    text: `Tu solicitud de licencia fue registrada correctamente. Código: ${codigo}`
  };

  try {
    await transporte.sendMail(opciones);
  } catch (error) {
    console.error('Error enviando correo:', error.message);
  }
}
