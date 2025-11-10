// src/validadores/contribuciones.validador.js
import Joi from 'joi';

export const esquemaContribucion = Joi.object({
  titulo: Joi.string().max(150).required(),
  descripcion: Joi.string().max(5000).required(),
  categoria: Joi.string().max(80).required()
});
