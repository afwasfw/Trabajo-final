// src/controladores/licencias.controlador.js
import * as servicio from '../servicios/licencias.servicio.js';
import { respuestaExitosa } from '../utilidades/respuestas.js';

export async function crearLicencia(req, res, siguiente) {
  try {
    const datos = req.datosValidados;
    const licencia = await servicio.crearLicencia(datos, req.usuario.id_usuario);
    respuestaExitosa(res, licencia, 201);
  } catch (error) {
    siguiente(error);
  }
}

export async function listarLicencias(req, res, siguiente) {
  try {
    const { limite = 50, desplazamiento = 0 } = req.query;
    const lista = await servicio.listarLicencias(limite, desplazamiento);
    respuestaExitosa(res, lista);
  } catch (error) {
    siguiente(error);
  }
}

export async function obtenerLicencia(req, res, siguiente) {
  try {
    const id = Number(req.params.id);
    const licencia = await servicio.obtenerLicencia(id);
    if (!licencia) return res.status(404).json({ exito: false, mensaje: 'Licencia no encontrada' });
    respuestaExitosa(res, licencia);
  } catch (error) {
    siguiente(error);
  }
}

export async function actualizarLicencia(req, res, siguiente) {
  try {
    const id = Number(req.params.id);
    const datos = req.datosValidados;
    const licencia = await servicio.actualizarLicencia(id, datos, req.usuario.id_usuario);
    respuestaExitosa(res, licencia);
  } catch (error) {
    siguiente(error);
  }
}
