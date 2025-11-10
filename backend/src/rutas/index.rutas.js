// src/rutas/index.rutas.js
import { Router } from 'express';
import rutasUsuarios from './usuarios.rutas.js';
import rutasLicencias from './licencias.rutas.js';
import rutasInspecciones from './inspecciones.rutas.js';
import rutasDocumentos from './documentos.rutas.js';
import rutasNotificaciones from './notificaciones.rutas.js';
import rutasHistorial from './historial.rutas.js';
import rutasPredicciones from './predicciones.rutas.js';
import rutasContribuciones from './contribuciones.rutas.js';

const enrutador = Router();

enrutador.use('/usuarios', rutasUsuarios);
enrutador.use('/licencias', rutasLicencias);
enrutador.use('/inspecciones', rutasInspecciones);
enrutador.use('/documentos', rutasDocumentos);
enrutador.use('/notificaciones', rutasNotificaciones);
enrutador.use('/historial', rutasHistorial);
enrutador.use('/predicciones', rutasPredicciones);
enrutador.use('/contribuciones', rutasContribuciones);

export default enrutador;
