// src/validadores/predicciones.validador.js
import Joi from 'joi';

export const esquemaPrediccion = Joi.object({
  id_licencia: Joi.number().integer().required(),
  modelo_usado: Joi.string().max(100).required(),
  parametros_entrada: Joi.object().required()
});
