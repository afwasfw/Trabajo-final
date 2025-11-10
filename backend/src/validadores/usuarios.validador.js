// src/validadores/usuarios.validador.js
import Joi from 'joi';

// ✅ Esquema para registro de usuario
export const esquemaRegistro = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  correo: Joi.string().email().required(),
  contrasena: Joi.string().min(6).max(50).required(),
  rol_nombre: Joi.string().valid('Administrador', 'Inspector', 'Ciudadano').required()
});

// ✅ Esquema para inicio de sesión
export const esquemaLogin = Joi.object({
  correo: Joi.string().email().required(),
  contrasena: Joi.string().min(6).max(50).required()
});

// ✅ Esquema para actualización de perfil (opcional)
export const esquemaActualizarUsuario = Joi.object({
  nombre: Joi.string().min(3).max(100),
  contrasena: Joi.string().min(6).max(50),
  activo: Joi.boolean()
});
    