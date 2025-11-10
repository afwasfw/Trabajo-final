import * as servicio from '../servicios/documentos.servicio.js';
import { respuestaExitosa } from '../utilidades/respuestas.js';

export async function subirDocumento(req, res, siguiente) {
  try {
    const datos = req.datosValidados;
    const idUsuario = req.usuario?.id_usuario || null;
    const creado = await servicio.subirDocumento(datos, idUsuario);
    respuestaExitosa(res, creado, 201);
  } catch (error) {
    siguiente(error);
  }
}

export async function listarDocumentos(req, res, siguiente) {
  try {
    const idLic = Number(req.query.id_licencia);
    if (!idLic) throw { estado: 400, mensaje: 'id_licencia requerido' };
    const docs = await servicio.listarDocumentosPorLicencia(idLic);
    respuestaExitosa(res, docs);
  } catch (error) {
    siguiente(error);
  }
}

export async function obtenerDocumento(req, res, siguiente) {
  try {
    const id = Number(req.params.id);
    if (!id) throw { estado: 400, mensaje: 'Id inválido' };
    const doc = await servicio.obtenerDocumentoPorId(id);
    if (!doc) return res.status(404).json({ exito: false, mensaje: 'Documento no encontrado' });
    respuestaExitosa(res, doc);
  } catch (error) {
    siguiente(error);
  }
}