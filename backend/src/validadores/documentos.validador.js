import Joi from 'joi';

export const esquemaDocumento = Joi.object({
  id_licencia: Joi.number().integer().allow(null),
  id_inspeccion: Joi.number().integer().allow(null),
  nombre_archivo: Joi.string().max(200).required(),
  tipo_archivo: Joi.string().max(50).required(),
  ruta_archivo: Joi.string().max(300).required()
});