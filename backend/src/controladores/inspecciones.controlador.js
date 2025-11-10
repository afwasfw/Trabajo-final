import * as servicio from '../servicios/inspecciones.servicio.js';
import { respuestaExitosa } from '../utilidades/respuestas.js';

export async function crearInspeccion(req, res, siguiente) {
  try {
    const datos = req.datosValidados;
    const idUsuario = req.usuario?.id_usuario || null;
    const creado = await servicio.crearInspeccion(datos, idUsuario);
    respuestaExitosa(res, creado, 201);
  } catch (error) {
    siguiente(error);
  }
}

export async function listarInspecciones(req, res, siguiente) {
  try {
    const { limite = 50, desplazamiento = 0 } = req.query;
    const rows = await servicio.listarInspecciones(limite, desplazamiento);
    respuestaExitosa(res, rows);
  } catch (error) {
    siguiente(error);
  }
}

export async function obtenerInspeccion(req, res, siguiente) {
  try {
    const id = Number(req.params.id);
    if (!id) throw { estado: 400, mensaje: 'Id inválido' };
    const fila = await servicio.obtenerInspeccionPorId(id);
    if (!fila) return res.status(404).json({ exito: false, mensaje: 'Inspección no encontrada' });
    respuestaExitosa(res, fila);
  } catch (error) {
    siguiente(error);
  }
}

export async function actualizarInspeccion(req, res, siguiente) {
  try {
    const id = Number(req.params.id);
    if (!id) throw { estado: 400, mensaje: 'Id inválido' };
    const cambios = req.datosValidados;
    const idUsuario = req.usuario?.id_usuario || null;
    const actualizada = await servicio.actualizarInspeccion(id, cambios, idUsuario);
    respuestaExitosa(res, actualizada);
  } catch (error) {
    siguiente(error);
  }
}