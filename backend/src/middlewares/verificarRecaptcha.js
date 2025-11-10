import axios from 'axios';
import { entorno } from '../configuracion/entorno.js';

export async function verificarRecaptcha(req, res, next) {
  try {
    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
      // Si el frontend no envió el token, detenemos el proceso.
      return res.status(400).json({ exito: false, mensaje: 'Verificación reCAPTCHA fallida: token no proporcionado.' });
    }

    // Construimos la URL para verificar el token con Google
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${entorno.recaptcha.secreto}&response=${recaptchaToken}`;

    // Hacemos la petición a los servidores de Google
    const { data } = await axios.post(url);

    // Google nos dice si fue exitoso y nos da una puntuación (score) de 0.0 a 1.0
    // Un umbral común y seguro es 0.5. Si el score es menor, probablemente es un bot.
    if (data.success && data.score >= 0.5) {
      next(); // La verificación es exitosa, permitimos que continúe al siguiente paso (el registro).
    } else {
      res.status(400).json({ exito: false, mensaje: 'Verificación reCAPTCHA fallida: Eres un robot.' });
    }
  } catch (error) {
    console.error('Error en la verificación de reCAPTCHA:', error);
    next(error);
  }
}
