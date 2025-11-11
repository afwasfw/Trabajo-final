// src/servicios/catalogo.servicio.js
import bd from '../configuracion/baseDatos.js';

/**
 * Obtiene todos los trámites activos del catálogo.
 * @returns {Promise<Array>}
 */
export async function listarCatalogo() {
  try {
    const catalogo = await bd('catalogo_tramites')
      .where('activo', true)
      .select('id_catalogo', 'nombre', 'descripcion', 'costo', 'requisitos');
    return catalogo;
  } catch (error) {
    console.error('Error en servicio al listar catálogo:', error);
    throw { estado: 500, mensaje: 'Error interno del servidor al obtener el catálogo.' };
  }
}