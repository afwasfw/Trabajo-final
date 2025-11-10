import { Router } from 'express';
import { crearNotificacion, listarNotificaciones, marcarLeido } from '../controladores/notificaciones.controlador.js';
import autenticacion from '../middlewares/autenticacion.js';

const rutas = Router();

rutas.post('/', autenticacion(['Administrador']), crearNotificacion); // solo admin crea notificaciones masivas
rutas.get('/', autenticacion(), listarNotificaciones);
rutas.post('/:id/leido', autenticacion(), marcarLeido);

export default rutas;