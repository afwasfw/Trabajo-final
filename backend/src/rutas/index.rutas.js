// src/rutas/index.rutas.js
import { Router } from 'express';
import rutasUsuarios from './usuarios.rutas.js';
// import rutasLicencias from './licencias.rutas.js'; // Desactivamos la ruta antigua
import rutasInspecciones from './inspecciones.rutas.js';
import rutasDocumentos from './documentos.rutas.js';
import rutasNotificaciones from './notificaciones.rutas.js';
import rutasHistorial from './historial.rutas.js';
import rutasPredicciones from './predicciones.rutas.js';
import rutasAdmin from './admin.rutas.js'; // 1. Importar las nuevas rutas de admin
import rutasContribuciones from './contribuciones.rutas.js';
// --- INICIO: NUEVAS RUTAS ---
import rutasCatalogo from './catalogo.rutas.js';
import rutasSolicitudes from './solicitudes.rutas.js';
// --- FIN: NUEVAS RUTAS ---

const enrutador = Router();

enrutador.use('/usuarios', rutasUsuarios);
// enrutador.use('/licencias', rutasLicencias); // Desactivamos la ruta antigua
enrutador.use('/inspecciones', rutasInspecciones);
enrutador.use('/documentos', rutasDocumentos);
enrutador.use('/notificaciones', rutasNotificaciones);
enrutador.use('/historial', rutasHistorial);
enrutador.use('/predicciones', rutasPredicciones);
enrutador.use('/admin', rutasAdmin); // 2. Registrar las rutas de admin
enrutador.use('/contribuciones', rutasContribuciones);

// --- INICIO: REGISTRO DE NUEVAS RUTAS ---
enrutador.use('/catalogo', rutasCatalogo);
enrutador.use('/solicitudes', rutasSolicitudes);
// --- FIN: REGISTRO DE NUEVAS RUTAS ---

export default enrutador;
