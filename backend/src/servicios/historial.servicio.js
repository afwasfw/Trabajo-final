// src/servicios/historial.servicio.js
import bd from '../configuracion/baseDatos.js';

export async function listarHistorialPorLicencia(idLicencia, limit = 50, offset = 0) {
  return bd('historial_estados')
    .where({ id_licencia: idLicencia })
    .orderBy('fecha_cambio','desc')
    .limit(Number(limit) || 50)
    .offset(Number(offset) || 0);
}
