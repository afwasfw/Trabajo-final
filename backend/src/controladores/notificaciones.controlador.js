import * as servicio from '../servicios/notificaciones.servicio.js';
import { respuestaExitosa } from '../utilidades/respuestas.js';

export async function crearNotificacion(req, res, siguiente) {
  try {
    const datos = req.datosValidados || req.body;
    const creada = await servicio.crearNotificacion(datos);
    respuestaExitosa(res, creada, 201);
  } catch (error) {
    siguiente(error);
  }
}

export async function listarNotificaciones(req, res, siguiente) {
  try {
    const idUsuario = req.usuario?.id_usuario;
    if (!idUsuario) throw { estado: 401, mensaje: 'Usuario no identificado' };
    const rows = await servicio.listarNotificaciones(idUsuario, req.query.limite, req.query.desplazamiento);
    respuestaExitosa(res, rows);
  } catch (error) {
    siguiente(error);
  }
}

export async function marcarLeido(req, res, siguiente) {
  try {
    const id = Number(req.params.id);
    const idUsuario = req.usuario?.id_usuario;
    const actualizado = await servicio.marcarComoLeido(id, idUsuario);
    respuestaExitosa(res, actualizado);
  } catch (error) {
    siguiente(error);
  }
}
