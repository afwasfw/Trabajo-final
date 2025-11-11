// src/rutas/admin.rutas.js
import { Router } from 'express';
import { getTodasLasSolicitudes } from '../controladores/admin.controlador.js';
import autenticacion from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

const rutas = Router();

// Protegemos la ruta para que solo los administradores puedan acceder
rutas.get('/solicitudes', autenticacion(), verificarRol('Administrador'), getTodasLasSolicitudes);

export default rutas;