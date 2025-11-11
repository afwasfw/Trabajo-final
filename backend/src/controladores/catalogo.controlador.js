// src/controladores/catalogo.controlador.js
import * as servicio from '../servicios/catalogo.servicio.js';
import { respuestaExitosa } from '../utilidades/respuestas.js';

/**
 * Controlador para listar todos los trámites disponibles en el catálogo.
 */
export async function getCatalogo(req, res, siguiente) {
  try {
    const catalogo = await servicio.listarCatalogo();
    respuestaExitosa(res, catalogo);
  } catch (error) {
    siguiente(error);
  }
}
