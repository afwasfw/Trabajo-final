import { Router } from 'express';
import { subirDocumento, listarDocumentos, obtenerDocumento } from '../controladores/documentos.controlador.js';
import validar from '../middlewares/validador.js';
import autenticacion from '../middlewares/autenticacion.js';
import { esquemaDocumento } from '../validadores/documentos.validador.js';

const rutas = Router();

rutas.post('/', autenticacion(['Administrador','Inspector','Ciudadano']), validar(esquemaDocumento), subirDocumento);
rutas.get('/', autenticacion(['Administrador','Inspector']), listarDocumentos);
rutas.get('/:id', autenticacion(['Administrador','Inspector']), obtenerDocumento);

export default rutas;