// knexfile.cjs
require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'municipalidad_yau'
    },
    migrations: {
      directory: './migraciones'
    },
    seeds: {
      directory: './semillas'
    }
  }
};
