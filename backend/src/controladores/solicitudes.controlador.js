// src/controladores/solicitudes.controlador.js
import * as servicio from '../servicios/solicitudes.servicio.js';
import { respuestaExitosa } from '../utilidades/respuestas.js';

/**
 * Controlador para crear una nueva solicitud de trámite.
 */
export async function crearSolicitud(req, res, siguiente) {
  try {
    // Multer separa los campos de texto (req.body) de los archivos (req.files)
    const datos = req.body;
    const archivos = req.files;
    const idUsuario = req.usuario.id_usuario; // Obtenido del token JWT

    const nuevaSolicitud = await servicio.crearSolicitud(idUsuario, datos, archivos);
    respuestaExitosa(res, nuevaSolicitud, 201, 'Solicitud creada exitosamente');
  } catch (error) {
    siguiente(error);
  }
}

/**
 * Controlador para obtener las solicitudes del usuario autenticado.
 */
export async function getMisSolicitudes(req, res, siguiente) {
  try {
    const idUsuario = req.usuario.id_usuario;
    // Extraemos los parámetros de paginación y búsqueda de la query
    const opciones = {
      limite: req.query.limite ? Number(req.query.limite) : 10,
      pagina: req.query.pagina ? Number(req.query.pagina) : 1,
      busqueda: req.query.busqueda || ''
    };
    const solicitudes = await servicio.obtenerMisSolicitudes(idUsuario, opciones);
    respuestaExitosa(res, solicitudes);
  } catch (error) {
    siguiente(error);
  }
}

/**
 * Controlador para obtener el detalle de una solicitud específica.
 */
export async function getSolicitudDetalle(req, res, siguiente) {
  try {
    const idSolicitud = Number(req.params.id);
    const idUsuario = req.usuario.id_usuario;

    const solicitud = await servicio.obtenerSolicitudPorId(idSolicitud, idUsuario);

    if (!solicitud) return res.status(404).json({ exito: false, mensaje: 'Solicitud no encontrada o no tienes permiso para verla.' });
    
    respuestaExitosa(res, solicitud);
  } catch (error) {
    siguiente(error);
  }
}