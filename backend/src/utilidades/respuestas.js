// src/utilidades/respuestas.js

export function respuestaExitosa(res, datos = null, codigo = 200, mensaje = 'Operación exitosa') {
  return res.status(codigo).json({
    exito: true,
    mensaje,
    datos
  });
}
