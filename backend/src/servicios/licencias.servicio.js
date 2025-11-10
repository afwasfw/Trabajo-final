// src/servicios/licencias.servicio.js
import bd from '../configuracion/baseDatos.js';
import { crearLoggerUsuario } from '../configuracion/registro.js';
import { enviarCorreoLicencia } from '../utilidades/correos.js';
import { generarCodigoLicencia } from '../utilidades/generadorCodigo.js';

export async function crearLicencia(datos, idUsuario) {
  const logger = crearLoggerUsuario(idUsuario);
  const codigo = generarCodigoLicencia();

  const [licenciaCreada] = await bd.transaction(async (trx) => {
    await trx.raw('SET LOCAL app.user_id = ?', [idUsuario]);
    const [licencia] = await trx('licencias')
      .insert({
        codigo,
        id_usuario: idUsuario,
        tipo: datos.tipo,
        descripcion: datos.descripcion,
        estado: 'Pendiente'
      })
      .returning(['id_licencia', 'codigo', 'tipo', 'descripcion', 'estado', 'fecha_creacion']);
    return licencia;
  });

  logger.info(`Licencia creada con código ${codigo}`);
  await enviarCorreoLicencia(datos.correo_contacto, codigo);
  return licenciaCreada;
}

export async function listarLicencias(limite = 50, desplazamiento = 0) {
  return bd('licencias')
    .join('usuarios', 'licencias.id_usuario', 'usuarios.id_usuario')
    .select(
      'licencias.id_licencia',
      'licencias.codigo',
      'licencias.tipo',
      'licencias.estado',
      'usuarios.nombre as solicitante',
      'licencias.fecha_creacion'
    )
    .orderBy('licencias.id_licencia', 'desc')
    .limit(Number(limite))
    .offset(Number(desplazamiento));
}

export async function obtenerLicencia(id) {
  return bd('licencias').where({ id_licencia: id }).first();
}

export async function actualizarLicencia(id, cambios, idUsuario) {
  const logger = crearLoggerUsuario(idUsuario);
  const [licencia] = await bd.transaction(async (trx) => {
    await trx.raw('SET LOCAL app.user_id = ?', [idUsuario]);
    const [actualizada] = await trx('licencias')
      .where({ id_licencia: id })
      .update(cambios)
      .returning(['id_licencia', 'codigo', 'tipo', 'estado', 'fecha_actualizacion']);
    return actualizada;
  });

  if (!licencia) throw { estado: 404, mensaje: 'Licencia no encontrada' };
  logger.info(`Licencia ${id} actualizada`);
  return licencia;
}
