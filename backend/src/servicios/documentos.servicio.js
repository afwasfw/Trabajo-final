// src/servicios/documentos.servicio.js
import bd from '../configuracion/baseDatos.js';

/**
 * Obtiene la información de un documento de forma segura,
 * verificando que pertenezca al usuario o que el usuario sea administrador.
 * @param {number} idDocumento - El ID del documento a descargar.
 * @param {number} idUsuario - El ID del usuario que realiza la petición.
 * @param {string} rolUsuario - El rol del usuario que realiza la petición.
 * @returns {Promise<object|null>} El objeto del documento si se encuentra y hay permiso, o null.
 */
export async function obtenerDocumentoSeguro(idDocumento, idUsuario, rolUsuario) {
  const query = bd('documentos as d')
    .join('solicitudes as s', 'd.id_solicitud', 's.id_solicitud')
    .where('d.id_documento', idDocumento)
    .select('d.url_archivo', 'd.nombre_doc')
    .first();

  // Si el usuario no es Administrador, añadimos la condición de que sea el dueño de la solicitud.
  if (rolUsuario !== 'Administrador') {
    query.andWhere('s.id_usuario', idUsuario);
  }

  const documento = await query;

  return documento;
}