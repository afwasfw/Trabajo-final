import Joi from 'joi';

export const esquemaCrearInspeccion = Joi.object({
  id_licencia: Joi.number().integer().required(),
  id_inspector: Joi.number().integer().required(),
  fecha_inspeccion: Joi.date().required(),
  observaciones: Joi.string().allow(null, '').max(2000)
});

export const esquemaActualizarInspeccion = Joi.object({
  estado: Joi.string().valid('Pendiente','Aprobada','Observada','Rechazado'),
  fecha_inspeccion: Joi.date(),
  observaciones: Joi.string().allow(null, '').max(2000)
});
