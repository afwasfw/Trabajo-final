// src/rutas/catalogo.rutas.js
import { Router } from 'express';
import { getCatalogo } from '../controladores/catalogo.controlador.js';
import autenticacion from '../middlewares/autenticacion.js';

const rutas = Router();

// Cualquier usuario autenticado puede ver el catálogo.
rutas.get('/', autenticacion(), getCatalogo);

export default rutas;