// src/controladores/historial.controlador.js
import * as servicio from '../servicios/historial.servicio.js';
import { respuestaExitosa } from '../utilidades/respuestas.js';

export async function listarHistorial(req, res, siguiente) {
  try {
    const idLic = Number(req.params.id);
    if (!idLic) throw { estado: 400, mensaje: 'Id licencia inválido' };
    const rows = await servicio.listarHistorialPorLicencia(idLic, req.query.limite, req.query.desplazamiento);
    respuestaExitosa(res, rows);
  } catch (error) {
    siguiente(error);
  }
}
