// src/rutas/contribuciones.rutas.js
import { Router } from 'express';
import { crearContribucion, listarContribuciones } from '../controladores/contribuciones.controlador.js';
import validar from '../middlewares/validador.js';
import autenticacion from '../middlewares/autenticacion.js';
import { esquemaContribucion } from '../validadores/contribuciones.validador.js';

const rutas = Router();

rutas.post('/', autenticacion(), validar(esquemaContribucion), crearContribucion);
rutas.get('/', autenticacion(['Administrador']), listarContribuciones);

export default rutas;
