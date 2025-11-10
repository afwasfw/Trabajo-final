// src/middlewares/autenticacion.js
import jwt from 'jsonwebtoken';
import { entorno } from '../configuracion/entorno.js';

/**
 * Middleware general de autenticación JWT.
 * Permite restringir acceso a roles específicos.
 * 
 * Ejemplo:
 *   app.get('/ruta', autenticacion(['Administrador', 'Inspector']), controlador);
 */
export default function autenticacion(rolesAceptados = []) {
  return async (req, res, siguiente) => {
    try {
      const cabecera = req.headers.authorization;
      if (!cabecera) {
        return res.status(401).json({ exito: false, mensaje: 'Acceso no autorizado' });
      }

      const token = cabecera.split(' ')[1];
      if (!token) {
        return res.status(401).json({ exito: false, mensaje: 'Token ausente' });
      }

      // Verificar JWT
      let payload;
      try {
        payload = jwt.verify(token, entorno.jwt.secreto);
      } catch {
        return res.status(401).json({ exito: false, mensaje: 'Token inválido o expirado' });
      }

      req.usuario = payload;

      // validar rol si corresponde
      if (rolesAceptados.length && !rolesAceptados.includes(req.usuario.rol_nombre)) {
        return res.status(403).json({ exito: false, mensaje: 'Permiso denegado' });
      }

      siguiente();
    } catch (err) {
      siguiente(err);
    }
  };
}
