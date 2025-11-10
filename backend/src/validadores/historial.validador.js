// src/validadores/historial.validador.js
import Joi from 'joi';

export const esquemaHistorial = Joi.object({
  id_licencia: Joi.number().integer().required(),
  observacion: Joi.string().min(5).max(255).required(),
  fecha_evento: Joi.date().required()
});
