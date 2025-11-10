// src/controladores/predicciones.controlador.js
import * as servicio from '../servicios/predicciones.servicio.js';
import { respuestaExitosa } from '../utilidades/respuestas.js';

export async function crearPrediccion(req, res, siguiente) {
  try {
    const datos = req.datosValidados;
    const idUsuario = req.usuario?.id_usuario || null;
    const resultado = await servicio.solicitarYGuardarPrediccion(datos, idUsuario);
    respuestaExitosa(res, resultado, 201);
  } catch (error) {
    siguiente(error);
  }
}

export async function listarPredicciones(req, res, siguiente) {
  try {
    const idLic = Number(req.params.id);
    if (!idLic) throw { estado: 400, mensaje: 'Id licencia inválido' };
    const rows = await servicio.listarPredicciones(idLic, req.query.limite, req.query.desplazamiento);
    respuestaExitosa(res, rows);
  } catch (error) {
    siguiente(error);
  }
}
