import bd from '../configuracion/baseDatos.js';

export async function subirDocumento(datos, idUsuario = null) {
  const creado = await bd.transaction(async (trx) => {
    if (idUsuario) await trx.raw('SET LOCAL app.user_id = ?', [idUsuario]);
    const [doc] = await trx('documentos')
      .insert({
        id_licencia: datos.id_licencia || null,
        id_inspeccion: datos.id_inspeccion || null,
        nombre_archivo: datos.nombre_archivo,
        tipo_archivo: datos.tipo_archivo,
        ruta_archivo: datos.ruta_archivo
      })
      .returning('*');
    return doc;
  });
  return creado;
}

export async function listarDocumentosPorLicencia(idLicencia) {
  return bd('documentos').where({ id_licencia: idLicencia }).orderBy('fecha_subida','desc');
}

export async function obtenerDocumentoPorId(id) {
  return bd('documentos').where({ id_documento: id }).first();
}