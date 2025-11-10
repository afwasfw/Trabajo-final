import { apiReference } from '@scalar/express-api-reference'

export const documentacionScalar = apiReference({
  spec: {
    openapi: '3.0.0',
    info: {
      title: 'API Municipalidad Yau',
      version: '1.0.0',
      description:
        'Documentación oficial del backend desarrollada con Scalar. Incluye usuarios y licencias.'
    },
    servers: [{ url: 'http://localhost:4000', description: 'Servidor local' }],
    tags: [
      { name: 'Usuarios', description: 'Operaciones relacionadas con usuarios' },
      { name: 'Licencias', description: 'Operaciones para gestión de licencias' }
    ],
    paths: {
      '/api/usuarios/registro': {
        post: {
          tags: ['Usuarios'],
          summary: 'Registrar nuevo usuario',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre_completo: { type: 'string', example: 'Juan Pérez' },
                    dni: { type: 'string', example: '12345678' },
                    correo: { type: 'string', example: 'juan@example.com' },
                    contrasena: { type: 'string', example: 'Password123' },
                    telefono: { type: 'string', example: '987654321' },
                    direccion: { type: 'string', example: 'Av. Lima 123' },
                    id_rol: { type: 'integer', example: 3 }
                  },
                  required: ['nombre_completo', 'correo', 'contrasena', 'id_rol']
                }
              }
            }
          },
          responses: {
            201: { description: 'Usuario registrado correctamente' },
            400: { description: 'Datos inválidos o incompletos' }
          }
        }
      },
      '/api/usuarios/login': {
        post: {
          tags: ['Usuarios'],
          summary: 'Iniciar sesión',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    correo: { type: 'string', example: 'juan@example.com' },
                    contrasena: { type: 'string', example: 'Password123' }
                  },
                  required: ['correo', 'contrasena']
                }
              }
            }
          },
          responses: {
            200: { description: 'Inicio de sesión exitoso (devuelve tokens)' },
            401: { description: 'Credenciales inválidas' }
          }
        }
      },
      '/api/usuarios/{id}': {
        get: {
          tags: ['Usuarios'],
          summary: 'Obtener datos de un usuario por ID',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }
          ],
          responses: {
            200: { description: 'Usuario encontrado' },
            404: { description: 'Usuario no existe' }
          },
          security: [{ bearerAuth: [] }]
        }
      },
      '/api/licencias': {
        get: {
          tags: ['Licencias'],
          summary: 'Listar todas las licencias registradas',
          parameters: [
            { name: 'limite', in: 'query', schema: { type: 'integer', example: 20 } },
            { name: 'desplazamiento', in: 'query', schema: { type: 'integer', example: 0 } }
          ],
          responses: {
            200: { description: 'Lista de licencias obtenida correctamente' },
            401: { description: 'Acceso no autorizado' }
          },
          security: [{ bearerAuth: [] }]
        },
        post: {
          tags: ['Licencias'],
          summary: 'Registrar nueva licencia',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tipo_negocio: { type: 'string', example: 'Bodega' },
                    area_m2: { type: 'number', example: 20 },
                    distrito: { type: 'string', example: 'Centro' },
                    zona: { type: 'string', example: 'Comercial' },
                    complejidad: { type: 'integer', example: 2 },
                    id_usuario: { type: 'integer', example: 2 }
                  },
                  required: ['tipo_negocio', 'area_m2', 'complejidad', 'id_usuario']
                }
              }
            }
          },
          responses: {
            201: { description: 'Licencia creada correctamente' },
            400: { description: 'Datos inválidos' }
          }
        }
      },
      '/api/licencias/{id}': {
        get: {
          tags: ['Licencias'],
          summary: 'Obtener una licencia por ID',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }
          ],
          responses: {
            200: { description: 'Licencia encontrada' },
            404: { description: 'No se encontró la licencia' }
          },
          security: [{ bearerAuth: [] }]
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  }
})
