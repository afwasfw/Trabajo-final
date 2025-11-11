import { Router } from 'express';
import { descargarDocumento } from '../controladores/documentos.controlador.js';
import autenticacion from '../middlewares/autenticacion.js';

const rutas = Router();

// Protegemos la ruta para que solo usuarios autenticados puedan intentar descargar
rutas.get('/:id/descargar', autenticacion(), descargarDocumento);

export default rutas;