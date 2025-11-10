import bd from '../configuracion/baseDatos.js';

/**
 * ejecutarConUsuario(idUsuario, callback)
 * Envuelve la callback en una transacción y setea app.user_id (para triggers)
 * callback recibe el trx (knex transaction) y debe devolver la promesa del trabajo.
 */
export async function ejecutarConUsuario(idUsuario, callback) {
  return bd.transaction(async (trx) => {
    await trx.raw('SET LOCAL app.user_id = ?', [idUsuario]);
    return callback(trx);
  });
}
