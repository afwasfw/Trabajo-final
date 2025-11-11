// src/servicios/admin.servicio.js
import bd from '../configuracion/baseDatos.js';

/**
 * Obtiene todas las solicitudes del sistema, con opciones de paginación y búsqueda.
 * @param {object} opciones - Opciones de paginación y búsqueda (limite, pagina, busqueda).
 * @returns {Promise<object>} Un objeto con la lista de solicitudes y la información de paginación.
 */
export async function obtenerTodasLasSolicitudes({ limite = 50, pagina = 1, busqueda = '' }) {
  const offset = (pagina - 1) * limite;

  // Construimos la consulta base
  const queryBase = bd('solicitudes as s')
    .join('catalogo_tramites as ct', 's.id_catalogo', 'ct.id_catalogo')
    .join('usuarios as u', 's.id_usuario', 'u.id_usuario');

  // Añadimos la condición de búsqueda si existe
  if (busqueda) {
    queryBase.where(function() {
      this.where('s.codigo_seguimiento', 'like', `%${busqueda}%`)
          .orWhere('ct.nombre', 'like', `%${busqueda}%`)
          .orWhere('u.nombre_completo', 'like', `%${busqueda}%`); // Búsqueda también por nombre de usuario
    });
  }

  // Clonamos la consulta para contar el total de registros sin paginación
  const totalQuery = queryBase.clone().count({ total: '*' }).first();
  
  // Aplicamos paginación y orden a la consulta principal
  const solicitudesQuery = queryBase
    .select(
      's.id_solicitud', 's.codigo_seguimiento', 'ct.nombre as nombre_tramite',
      'u.nombre_completo as nombre_usuario', // Incluimos el nombre del usuario
      's.estado', 's.fecha_solicitud', 's.prioridad_calculada' // Incluimos la prioridad
    )
    .orderBy('s.fecha_solicitud', 'desc')
    .limit(limite)
    .offset(offset);

  // Ejecutamos ambas consultas en paralelo
  const [solicitudes, totalResult] = await Promise.all([solicitudesQuery, totalQuery]);

  return {
    datos: solicitudes,
    paginacion: { total: totalResult.total, pagina, limite }
  };
}