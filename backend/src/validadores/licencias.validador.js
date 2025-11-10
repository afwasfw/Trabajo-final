// src/validadores/licencias.validador.js
import Joi from 'joi';

export const esquemaLicencia = Joi.object({
  tipo: Joi.string().min(3).max(50).required(),
  descripcion: Joi.string().min(5).max(255).required(),
  correo_contacto: Joi.string().email().required()
});
