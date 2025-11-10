// src/rutas/usuarios.rutas.js
import { Router } from 'express';
import { registrarUsuario, iniciarSesion, obtenerUsuario, loginGoogle } from '../controladores/usuarios.controlador.js';
import { validarCuerpo } from '../middlewares/validador.js';
import { esquemaRegistro, esquemaLogin } from '../validadores/usuarios.validador.js';
import autenticacion from '../middlewares/autenticacion.js';
import { verificarRecaptcha } from '../middlewares/verificarRecaptcha.js'; 

const rutas = Router();

// Registro de usuario
// CORRECCIÓN: Se añade el middleware 'verificarRecaptcha' en la secuencia correcta.
// La petición pasará primero por validarCuerpo, luego por verificarRecaptcha y finalmente llegará a registrarUsuario.
rutas.post('/registro', validarCuerpo(esquemaRegistro), verificarRecaptcha, registrarUsuario);

// Inicio de sesión
rutas.post('/login', validarCuerpo(esquemaLogin), iniciarSesion);

// Obtener usuario por ID (solo un administrador puede hacerlo)
rutas.get('/:id', autenticacion(['Administrador']), obtenerUsuario);
// --- INICIO: NUEVA RUTA PARA LOGIN CON GOOGLE ---
rutas.post('/login/google', loginGoogle);

export default rutas;
