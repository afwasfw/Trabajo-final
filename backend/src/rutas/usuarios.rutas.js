// src/rutas/usuarios.rutas.js
import { Router } from 'express';
// CORRECCIÓN: Eliminamos los imports de getMiPerfil y actualizarMiPerfil que no existen
import { registrarUsuario, iniciarSesion, obtenerUsuario, loginGoogle } from '../controladores/usuarios.controlador.js';
import { validarCuerpo } from '../middlewares/validador.js';
import { esquemaRegistro, esquemaLogin } from '../validadores/usuarios.validador.js';
import autenticacion from '../middlewares/autenticacion.js';
import { verificarRecaptcha } from '../middlewares/verificarRecaptcha.js'; 

const rutas = Router();

// Registro de usuario
rutas.post('/registro', validarCuerpo(esquemaRegistro), verificarRecaptcha, registrarUsuario);

// Inicio de sesión
rutas.post('/login', validarCuerpo(esquemaLogin), iniciarSesion);

// --- RUTA PARA LOGIN CON GOOGLE ---
rutas.post('/login/google', loginGoogle);

// Obtener usuario por ID (solo un administrador puede hacerlo)
rutas.get('/:id', autenticacion(['Administrador']), obtenerUsuario);

// --- CORRECCIÓN: Eliminamos las rutas de perfil que ya no se usarán ---

export default rutas;
