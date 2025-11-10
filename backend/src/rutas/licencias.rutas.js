// src/rutas/licencias.rutas.js
import express from 'express';
import { validarCuerpo } from '../middlewares/validador.js';
import autenticacion from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';
import {
  crearLicencia,
  listarLicencias,
  obtenerLicencia,
  actualizarLicencia
} from '../controladores/licencias.controlador.js';
import { esquemaLicencia } from '../validadores/licencias.validador.js';

const ruta = express.Router();

// Crear una nueva licencia (solo ciudadanos)
ruta.post(
  '/',
  autenticacion(['Ciudadano']),
  validarCuerpo(esquemaLicencia),
  crearLicencia
);

// Listar todas las licencias (solo administradores e inspectores)
ruta.get(
  '/',
  autenticacion(['Administrador', 'Inspector']),
  listarLicencias
);

// Obtener una licencia específica (cualquier usuario autenticado)
ruta.get(
  '/:id',
  autenticacion(),
  obtenerLicencia
);

// Actualizar licencia (solo inspectores o administradores)
ruta.put(
  '/:id',
  autenticacion(['Inspector', 'Administrador']),
  validarCuerpo(esquemaLicencia),
  actualizarLicencia
);

export default ruta;
