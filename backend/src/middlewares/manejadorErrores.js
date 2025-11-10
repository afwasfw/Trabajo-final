// src/middlewares/manejadorErrores.js
import registro from '../configuracion/registro.js';

export default function manejadorErrores(error, req, res, siguiente) {
  const estado = error?.estado || 500;
  const mensaje = error?.mensaje || 'Error interno del servidor';
  const detalles = error?.detalles || null;

  registro.error({ err: error, path: req.originalUrl });

  res.status(estado).json({ exito: false, mensaje, detalles });
}
