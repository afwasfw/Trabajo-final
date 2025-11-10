// src/configuracion/baseDatos.js
import knexConfig from '../../knexfile.cjs';
import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();
//admin1234
// Forzar conversión explícita de la contraseña a string (Node 24 fix)
const configuracion = {
  ...knexConfig.development,
  connection: {
    ...knexConfig.development.connection,
    password: String(process.env.DB_PASS)
  }
};

const bd = knex(configuracion);

bd.raw('SELECT NOW()')
  .then(() => console.log('Conexión a PostgreSQL exitosa'))
  .catch((err) => console.error('Error al conectar con PostgreSQL:', err.message));

export default bd;
