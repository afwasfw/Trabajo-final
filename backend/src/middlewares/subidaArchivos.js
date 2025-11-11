// src/middlewares/subidaArchivos.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegurarse de que el directorio de subidas exista
const dirSubidas = 'subidas/';
if (!fs.existsSync(dirSubidas)) {
  fs.mkdirSync(dirSubidas, { recursive: true });
}

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirSubidas); // Directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    // Crear un nombre de archivo único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Exportar el middleware de multer configurado
export const upload = multer({ storage: storage });