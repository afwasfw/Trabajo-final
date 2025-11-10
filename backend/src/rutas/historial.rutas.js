// src/rutas/historial.rutas.js
import { Router } from 'express';
import { listarHistorial } from '../controladores/historial.controlador.js';
import autenticacion from '../middlewares/autenticacion.js';

const rutas = Router();

rutas.get('/licencia/:id', autenticacion(['Administrador','Inspector']), listarHistorial);

export default rutas;
