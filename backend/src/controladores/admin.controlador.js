// src/controladores/admin.controlador.js
import * as servicio from '../servicios/admin.servicio.js';
import { respuestaExitosa } from '../utilidades/respuestas.js';

/**
 * Controlador para obtener todas las solicitudes (solo para administradores).
 */
export async function getTodasLasSolicitudes(req, res, siguiente) {
  try {
    // Extraemos los parámetros de paginación y búsqueda de la query
    const opciones = {
      limite: req.query.limite ? Number(req.query.limite) : 50,
      pagina: req.query.pagina ? Number(req.query.pagina) : 1,
      busqueda: req.query.busqueda || ''
    };
    const resultado = await servicio.obtenerTodasLasSolicitudes(opciones);
    respuestaExitosa(res, resultado);
  } catch (error) {
    siguiente(error);
  }
}