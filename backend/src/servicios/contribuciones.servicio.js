// src/servicios/contribuciones.servicio.js
import bd from '../configuracion/baseDatos.js';

export async function crearContribucion(datos, idUsuario = null) {
  const [c] = await bd.transaction(async (trx) => {
    if (idUsuario) await trx.raw('SET LOCAL app.user_id = ?', [idUsuario]);
    const [ins] = await trx('contribuciones')
      .insert({
        id_usuario: idUsuario,
        titulo: datos.titulo,
        descripcion: datos.descripcion,
        categoria: datos.categoria
      })
      .returning('*');
    return ins;
  });
  return c;
}

export async function listarContribuciones(limit = 50, offset = 0) {
  return bd('contribuciones').orderBy('fecha_envio','desc').limit(Number(limit)||50).offset(Number(offset)||0);
}
