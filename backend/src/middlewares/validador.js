// src/middlewares/validador.js
import Joi from 'joi';

// Middleware genérico para validar el cuerpo con un esquema Joi
export function validarCuerpo(esquema) {
  return (req, res, siguiente) => {
    const { error, value } = esquema.validate(req.body, { abortEarly: false, stripUnknown: true });

    if (error) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Datos inválidos',
        errores: error.details.map((d) => d.message)
      });
    }

    req.datosValidados = value;
    siguiente();
  };
}

// Alias para mantener compatibilidad con rutas antiguas
export default function validar(esquema) {
  return validarCuerpo(esquema);
}
