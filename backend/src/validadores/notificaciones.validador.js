// src/validadores/notificacion.validador.js
import Joi from 'joi';

export const esquemaNotificacion = Joi.object({
  id_usuario: Joi.number().integer().required(),
  titulo: Joi.string().min(3).max(100).required(),
  mensaje: Joi.string().min(5).max(500).required(),
  tipo: Joi.string().valid('Alerta', 'Aviso', 'Recordatorio').required()
});
