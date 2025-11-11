// src/servicios/ml.servicio.js
import { PythonShell } from 'python-shell';
import path from 'path';

/**
 * Predice la prioridad de una solicitud utilizando el modelo de Python.
 * @param {object} datosParaPredecir - Objeto con las características para el modelo.
 * @returns {Promise<string>} La prioridad predicha ('Alta', 'Media', 'Baja') o 'Media' por defecto.
 */
export async function predecirPrioridad(datosParaPredecir) {
  // Definir la ruta al script de Python
  const rutaScript = path.join(process.cwd(), 'python_scripts', 'predict.py');

  const opciones = {
    mode: 'text',
    pythonOptions: ['-u'], // unbuffered stdout
    scriptPath: path.dirname(rutaScript),
    args: [JSON.stringify(datosParaPredecir)] // Pasar los datos como un string JSON
  };

  return new Promise((resolve, reject) => {
    PythonShell.run(path.basename(rutaScript), opciones)
      .then(mensajes => {
        // La salida del script de Python es un array de mensajes (líneas impresas)
        if (mensajes && mensajes.length > 0) {
          const prediccion = mensajes[0];
          if (['Alta', 'Media', 'Baja'].includes(prediccion)) {
            resolve(prediccion);
          } else {
            // Si el script de Python devolvió un error
            console.error('Error desde el script de Python:', prediccion);
            resolve('Media'); // Devolver un valor por defecto en caso de error
          }
        } else {
          resolve('Media'); // Valor por defecto si no hay salida
        }
      })
      .catch(err => {
        console.error('Fallo al ejecutar el script de Python:', err);
        resolve('Media'); // Devolver un valor por defecto en caso de fallo
      });
  });
}
