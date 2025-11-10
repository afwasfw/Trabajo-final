import { Router } from 'express';
import {
  crearInspeccion,
  listarInspecciones,
  obtenerInspeccion,
  actualizarInspeccion
} from '../controladores/inspecciones.controlador.js';
import validar from '../middlewares/validador.js';
import autenticacion from '../middlewares/autenticacion.js';
import { esquemaCrearInspeccion, esquemaActualizarInspeccion } from '../validadores/inspecciones.validador.js';

const rutas = Router();

rutas.post('/', autenticacion(['Administrador','Inspector']), validar(esquemaCrearInspeccion), crearInspeccion);
rutas.get('/', autenticacion(['Administrador','Inspector']), listarInspecciones);
rutas.get('/:id', autenticacion(['Administrador','Inspector']), obtenerInspeccion);
rutas.put('/:id', autenticacion(['Administrador','Inspector']), validar(esquemaActualizarInspeccion), actualizarInspeccion);

export default rutas;
