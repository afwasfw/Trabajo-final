import bd from '../configuracion/baseDatos.js';
import registro from '../configuracion/registro.js';

export async function crearNotificacion({ id_usuario, titulo, mensaje }) {
  const [n] = await bd('notificaciones').insert({
    id_usuario,
    titulo,
    mensaje
  }).returning('*');

  registro.info({ msg: 'Notificación creada', id: n.id_notificacion });
  return n;
}

export async function listarNotificaciones(idUsuario, limit = 50, offset = 0) {
  return bd('notificaciones')
    .where({ id_usuario: idUsuario })
    .orderBy('fecha_envio','desc')
    .limit(Number(limit) || 50)
    .offset(Number(offset) || 0);
}

export async function marcarComoLeido(idNotificacion, idUsuario) {
  const [n] = await bd('notificaciones')
    .where({ id_notificacion: idNotificacion, id_usuario: idUsuario })
    .update({ leido: true })
    .returning('*');
  if (!n) throw { estado: 404, mensaje: 'Notificación no encontrada' };
  return n;
}
