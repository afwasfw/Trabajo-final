// src/rutas/solicitudes.rutas.js
import { Router } from 'express';
import { crearSolicitud, getMisSolicitudes, getSolicitudDetalle } from '../controladores/solicitudes.controlador.js';
import autenticacion from '../middlewares/autenticacion.js';
import { upload } from '../middlewares/subidaArchivos.js';

const rutas = Router();

// Protegemos todas las rutas de solicitudes
rutas.use(autenticacion());

rutas.post('/', upload.any(), crearSolicitud);
rutas.get('/mis-solicitudes', getMisSolicitudes);
rutas.get('/:id', getSolicitudDetalle); // Nueva ruta para el detalle

export default rutas;