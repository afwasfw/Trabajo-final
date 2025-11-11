// src/controladores/documentos.controlador.js
import path from 'path';
import fs from 'fs';
import * as servicio from '../servicios/documentos.servicio.js';

/**
 * Controlador para descargar un archivo de forma segura.
 */
export async function descargarDocumento(req, res, siguiente) {
  try {
    const idDocumento = Number(req.params.id);
    const { id_usuario, rol } = req.usuario; // Datos del token JWT

    const documento = await servicio.obtenerDocumentoSeguro(idDocumento, id_usuario, rol);

    if (!documento) {
      return res.status(404).json({ exito: false, mensaje: 'Documento no encontrado o no tienes permiso para acceder a él.' });
    }

    const rutaAbsoluta = path.resolve(documento.url_archivo);

    // Verificamos que el archivo exista físicamente antes de intentar enviarlo
    if (!fs.existsSync(rutaAbsoluta)) {
      return res.status(404).json({ exito: false, mensaje: 'El archivo físico no se encuentra en el servidor.' });
    }

    // res.download() se encarga de establecer las cabeceras correctas para la descarga
    res.download(rutaAbsoluta, documento.nombre_doc);

  } catch (error) {
    siguiente(error);
  }
}