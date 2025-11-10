// src/rutas/predicciones.rutas.js
import { Router } from 'express';
import { crearPrediccion, listarPredicciones } from '../controladores/predicciones.controlador.js';
import validar from '../middlewares/validador.js';
import autenticacion from '../middlewares/autenticacion.js';
import { esquemaPrediccion } from '../validadores/predicciones.validador.js';

const rutas = Router();

rutas.post('/', autenticacion(['Administrador','Inspector']), validar(esquemaPrediccion), crearPrediccion);
rutas.get('/licencia/:id', autenticacion(['Administrador','Inspector']), listarPredicciones);

export default rutas;
