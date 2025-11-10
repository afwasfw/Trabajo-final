import express from 'express';
import cors from 'cors'; // 1. IMPORTAMOS CORS
import path from 'path';
import { fileURLToPath } from 'url';
import { documentacionScalar } from './configuracion/scalar.js';
import rutas from './rutas/index.rutas.js';
import manejadorErrores from './middlewares/manejadorErrores.js';

// Inicialización
const app = express();

// Necesario para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middlewares globales ---

// 2. CONFIGURAMOS CORS ANTES DE LAS RUTAS
// Esto permite que tu frontend en localhost:5173 haga peticiones a este backend.
app.use(cors({
  origin: 'http://localhost:5173', // El origen de tu app de React
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
}));

// Middleware para que Express entienda JSON
app.use(express.json());

// --- Rutas principales ---
app.use('/api', rutas);

// --- Documentación ---
app.use('/docs', documentacionScalar);

// Servir archivo OpenAPI para la documentación
app.use('/openapi.json', express.static(path.join(__dirname, '../openapi.json')));

// --- Middleware de errores (debe ir al final) ---
app.use(manejadorErrores);

// Configuración del puerto
const puerto = process.env.PUERTO || 4000;

// Arranque del servidor
app.listen(puerto, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${puerto}`);
  console.log(`📄 Documentación disponible en http://localhost:${puerto}/docs`);
});

