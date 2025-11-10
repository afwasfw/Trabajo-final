// src/configuracion/scalar.js
import path from 'path';
import { fileURLToPath } from 'url';
import { apiReference } from '@scalar/express-api-reference';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const documentacionScalar = apiReference({
  spec: {
    url: '/openapi.json'
  },
  theme: 'modern',
  layout: 'purple',
  meta: {
    title: 'API Municipalidad Yauyos',
    description: 'Documentación oficial del backend'
  }
});
