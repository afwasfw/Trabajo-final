// src/configuracion/registro.js
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nivel = process.env.LOG_LEVEL || 'info';

// Asegurar carpeta de logs
const rutaLogs = path.join(__dirname, '../../logs');
try { fs.mkdirSync(rutaLogs, { recursive: true }); } catch { /* no bloquear si falla */ }

// Crear destino de archivo (rotación externa recomendada en producción)
const destinoArchivo = pino.destination(path.join(rutaLogs, 'app.log'));

// Intentamos usar pino-pretty para consola legible en desarrollo, si está disponible
let registro;
try {
  registro = pino({
    level: nivel,
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard' }
    }
  }, destinoArchivo);
} catch (err) {
  // Fallback simple a logger sin transport bonito
  registro = pino({ level: nivel }, destinoArchivo);
}

/**
 * Middleware para adjuntar un logger por petición.
 * Uso: app.use(attachLogger) — luego en controladores usar req.logger.info(...)
 */
export function attachLogger(req, res, siguiente) {
  try {
    const meta = {
      ruta: req.originalUrl,
      metodo: req.method,
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    };
    req.logger = registro.child(meta);
  } catch (e) {
    req.logger = registro;
  }
  siguiente();
}

/**
 * Crear un logger hijo con id de usuario (útil para operaciones en servicios).
 * Ejemplo: const lg = crearLoggerUsuario(12); lg.info('accion realizada')
 */
export function crearLoggerUsuario(idUsuario) {
  return registro.child({ id_usuario: idUsuario });
}

export default registro;
