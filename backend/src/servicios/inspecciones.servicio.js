import bd from '../configuracion/baseDatos.js';
import registro from '../configuracion/registro.js';

export async function crearInspeccion(datos, idUsuarioCreador = null) {
  // validaciones de negocio simples
  const licencia = await bd('licencias').where({ id_licencia: datos.id_licencia }).first();
  if (!licencia) throw { estado: 400, mensaje: 'Licencia no encontrada' };

  const nuevo = await bd.transaction(async (trx) => {
    if (idUsuarioCreador) await trx.raw('SET LOCAL app.user_id = ?', [idUsuarioCreador]);
    const [ins] = await trx('inspecciones')
      .insert({
        id_licencia: datos.id_licencia,
        id_inspector: datos.id_inspector,
        fecha_inspeccion: datos.fecha_inspeccion,
        observaciones: datos.observaciones || null
      })
      .returning('*');
    return ins;
  });

  registro.info({ msg: 'Inspección creada', id: nuevo.id_inspeccion });
  return nuevo;
}

export async function listarInspecciones(limit = 50, offset = 0) {
  return bd('inspecciones')
    .select('id_inspeccion','id_licencia','id_inspector','fecha_inspeccion','estado','observaciones','fecha_registro')
    .orderBy('fecha_inspeccion','desc')
    .limit(Number(limit) || 50)
    .offset(Number(offset) || 0);
}

export async function obtenerInspeccionPorId(id) {
  return bd('inspecciones').where({ id_inspeccion: id }).first();
}

export async function actualizarInspeccion(id, cambios, idUsuario = null) {
  return bd.transaction(async (trx) => {
    if (idUsuario) await trx.raw('SET LOCAL app.user_id = ?', [idUsuario]);
    const [actualizada] = await trx('inspecciones')
      .where({ id_inspeccion: id })
      .update({ ...cambios })
      .returning('*');
    if (!actualizada) throw { estado: 404, mensaje: 'Inspección no encontrada' };
    return actualizada;
  });
}