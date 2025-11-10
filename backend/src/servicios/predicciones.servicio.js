// src/servicios/predicciones.servicio.js
import bd from '../configuracion/baseDatos.js';
import axios from 'axios';
import registro from '../configuracion/registro.js';

const ML_ENDPOINT = process.env.ML_ENDPOINT || 'http://localhost:8000/predict';

export async function solicitarYGuardarPrediccion(datos, idUsuario = null) {
  // llamada al servicio ML (puede fallar, capturamos error)
  let respuestaML;
  try {
    respuestaML = await axios.post(ML_ENDPOINT, datos.parametros_entrada, { timeout: 15000 });
  } catch (err) {
    throw { estado: 502, mensaje: 'Error al comunicarse con servicio ML', detalles: err.message };
  }

  // ejemplo de respuesta esperada: { probabilidad: 0.78, clasificacion: 'Alto' }
  const resultado = respuestaML.data || {};
  const guardada = await bd.transaction(async (trx) => {
    if (idUsuario) await trx.raw('SET LOCAL app.user_id = ?', [idUsuario]);
    const [p] = await trx('predicciones_ml')
      .insert({
        id_licencia: datos.id_licencia,
        modelo_usado: datos.modelo_usado,
        probabilidad_riesgo: resultado.probabilidad ?? 0,
        clasificacion: resultado.clasificacion ?? 'Desconocido',
        parametros_entrada: JSON.stringify(datos.parametros_entrada)
      })
      .returning('*');
    return p;
  });

  registro.info({ msg: 'Predicción guardada', id: guardada.id_prediccion });
  return { guardada, resultado };
}

export async function listarPredicciones(idLicencia, limit = 50, offset = 0) {
  return bd('predicciones_ml').where({ id_licencia: idLicencia }).orderBy('fecha_prediccion','desc').limit(Number(limit)||50).offset(Number(offset)||0);
}
