import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { documentacionScalar } from './configuracion/scalar.js';
import rutas from './rutas/index.rutas.js';
import manejadorErrores from './middlewares/manejadorErrores.js';
import { attachLogger } from './configuracion/registro.js';
import { entorno } from './configuracion/entorno.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(attachLogger);
app.use(express.json());
app.use('/api', rutas);

// Servir openapi.json para la documentación
app.use('/openapi.json', express.static(path.join(__dirname, '../openapi.json')));

// Ruta para la documentación con Scalar
app.use('/docs', documentacionScalar);

app.use(manejadorErrores);

app.listen(entorno.puerto, () => {
  console.log(`Servidor ejecutándose en puerto ${entorno.puerto}`);
});

export default app;
