// src/controladores/contribuciones.controlador.js
import * as servicio from '../servicios/contribuciones.servicio.js';
import { respuestaExitosa } from '../utilidades/respuestas.js';

export async function crearContribucion(req, res, siguiente) {
  try {
    const datos = req.datosValidados;
    const idUsuario = req.usuario?.id_usuario || null;
    const creada = await servicio.crearContribucion(datos, idUsuario);
    respuestaExitosa(res, creada, 201);
  } catch (error) {
    siguiente(error);
  }
}

export async function listarContribuciones(req, res, siguiente) {
  try {
    const rows = await servicio.listarContribuciones(req.query.limite, req.query.desplazamiento);
    respuestaExitosa(res, rows);
  } catch (error) {
    siguiente(error);
  }
}
