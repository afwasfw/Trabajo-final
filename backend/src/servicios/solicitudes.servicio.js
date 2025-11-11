// src/servicios/solicitudes.servicio.js
import bd from '../configuracion/baseDatos.js';
import { v4 as uuidv4 } from 'uuid';
import { predecirPrioridad } from './ml.servicio.js';

/**
 * Crea una nueva solicitud de trámite para un usuario.
 * @param {number} idUsuario - El ID del usuario que crea la solicitud.
 * @param {object} datos - Los datos de texto del formulario.
 * @param {Array} archivos - Los archivos subidos por multer.
 * @returns {Promise<object>} La solicitud creada.
 */
export async function crearSolicitud(idUsuario, datos, archivos) {
  let datos_especificos = JSON.parse(datos.datos_especificos || '{}');
  
  // CORRECCIÓN: Añadir fecha_evento a datos_especificos si existe
  if (datos.fecha_evento) {
    datos_especificos.fecha_evento = datos.fecha_evento; // La fecha ya viene como ISO string desde el frontend
  }
  const { id_catalogo } = datos;

  if (!id_catalogo || !idUsuario) {
    throw { estado: 400, mensaje: 'Faltan datos requeridos (id_catalogo, id_usuario).' };
  }

  return bd.transaction(async (trx) => {
    try {
      const tramiteInfo = await trx('catalogo_tramites').where('id_catalogo', id_catalogo).first();
      if (!tramiteInfo) throw { estado: 404, mensaje: 'El tipo de trámite seleccionado no existe.' };

      const factorDatosEspecificos = () => {
        if (parseInt(id_catalogo, 10) === 1) return (datos_especificos.area_m2 || 0) / 500;
        if (parseInt(id_catalogo, 10) === 4) return datos_especificos.tipo_evento === 'Masivo' ? 1.0 : 0.5;
        return 0.0;
      };

      const datosParaPredecir = {
        nombre_tramite: tramiteInfo.nombre,
        area_responsable: tramiteInfo.area_responsable,
        mes_solicitud: new Date().getMonth() + 1,
        documentos_adjuntos: archivos ? archivos.length : 0,
        factor_datos_especificos: factorDatosEspecificos()
      };

      const prioridadPredicha = await predecirPrioridad(datosParaPredecir);

      const nuevaSolicitud = {
        codigo_seguimiento: `YAU-${new Date().getFullYear()}-${uuidv4().split('-')[0].toUpperCase()}`,
        id_catalogo,
        id_usuario: idUsuario,
        datos_especificos: JSON.stringify(datos_especificos),
        prioridad_calculada: prioridadPredicha
      };

      const [idSolicitud] = await trx('solicitudes').insert(nuevaSolicitud);

      if (archivos && archivos.length > 0) {
        const documentosParaInsertar = archivos.map(archivo => ({
          id_solicitud: idSolicitud,
          nombre_doc: archivo.originalname,
          url_archivo: archivo.path,
          tipo: archivo.mimetype,
        }));
        await trx('documentos').insert(documentosParaInsertar);
      }

      const solicitudCreada = await trx('solicitudes').where('id_solicitud', idSolicitud).first();
      return solicitudCreada;

    } catch (error) {
      console.error('Error en transacción al crear solicitud:', error);
      throw { estado: 500, mensaje: 'Error interno del servidor al procesar la solicitud.' };
    }
  });
}

export async function obtenerMisSolicitudes(idUsuario, { limite = 10, pagina = 1, busqueda = '' }) {
  const offset = (pagina - 1) * limite;

  // Construimos la consulta base
  const queryBase = bd('solicitudes as s')
    .join('catalogo_tramites as ct', 's.id_catalogo', 'ct.id_catalogo')
    .where('s.id_usuario', idUsuario);

  // Añadimos la condición de búsqueda si existe
  if (busqueda) {
    queryBase.where(function() {
      this.where('s.codigo_seguimiento', 'like', `%${busqueda}%`)
          .orWhere('ct.nombre', 'like', `%${busqueda}%`);
    });
  }

  // Clonamos la consulta para contar el total de registros sin paginación
  const totalQuery = queryBase.clone().count({ total: '*' }).first();
  
  // Aplicamos paginación y orden a la consulta principal
  const solicitudesQuery = queryBase
    .select('s.id_solicitud', 's.codigo_seguimiento', 'ct.nombre as nombre_tramite', 's.estado', 's.fecha_solicitud')
    .orderBy('s.fecha_solicitud', 'desc')
    .limit(limite)
    .offset(offset);

  // Ejecutamos ambas consultas en paralelo
  const [solicitudes, totalResult] = await Promise.all([solicitudesQuery, totalQuery]);

  return {
    datos: solicitudes,
    paginacion: {
      total: totalResult.total,
      pagina,
      limite
    }
  };
}

/**
 * Obtiene los detalles completos de una solicitud, incluyendo sus documentos.
 * @param {number} idSolicitud - El ID de la solicitud a buscar.
 * @param {number} idUsuario - El ID del usuario para asegurar que solo vea sus propias solicitudes.
 * @returns {Promise<object|null>}
 */
export async function obtenerSolicitudPorId(idSolicitud, idUsuario) {
  // 1. Obtener los datos principales de la solicitud, uniéndolos con el catálogo
  const solicitud = await bd('solicitudes as s')
    .join('catalogo_tramites as ct', 's.id_catalogo', 'ct.id_catalogo')
    .where({ 's.id_solicitud': idSolicitud, 's.id_usuario': idUsuario })
    .select('s.*', 'ct.nombre as nombre_tramite', 'ct.descripcion as descripcion_tramite')
    .first();

  // Si no se encuentra la solicitud o no pertenece al usuario, devolvemos null
  if (!solicitud) {
    return null;
  }

  // 2. Obtener los documentos asociados a esa solicitud
  const documentos = await bd('documentos')
    .where('id_solicitud', idSolicitud)
    .select('id_documento', 'nombre_doc', 'url_archivo');

  // 3. Combinar todo en un solo objeto y devolverlo
  return { ...solicitud, documentos };
}