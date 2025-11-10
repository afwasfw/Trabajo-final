// src/controladores/usuarios.controlador.js
import * as servicio from '../servicios/usuarios.servicio.js';
import { respuestaExitosa } from '../utilidades/respuestas.js';
import admin from '../configuracion/firebase-admin.js';

// Crear nuevo usuario
export async function registrarUsuario(req, res, siguiente) {
  try {
    // CORRECCIÓN: Se pasa el 'req.body' completo, que contiene todos los campos del formulario,
    // en lugar de 'req.datosValidados' que solo contenía los campos validados.
    const nuevoUsuario = await servicio.crearUsuario(req.body);
    respuestaExitosa(res, nuevoUsuario, 201, 'Usuario registrado con éxito');
  } catch (error) {
    siguiente(error);
  }
}

// Iniciar sesión
export async function iniciarSesion(req, res, siguiente) {
  try {
    // Para el login, 'req.datosValidados' es correcto porque solo se necesita correo y contraseña.
    const datos = req.datosValidados;
    const resultado = await servicio.iniciarSesion(datos);
    respuestaExitosa(res, resultado);
  } catch (error) {
    siguiente(error);
  }
}

// --- INICIO: NUEVO CONTROLADOR PARA LOGIN CON GOOGLE ---
export async function loginGoogle(req, res, siguiente) {
  try {
    const { idToken } = req.body;
    // Verificar el token de Google usando Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    const { name, email, picture } = decodedToken;

    // Llamar al servicio para encontrar o crear el usuario en nuestra BD
    const resultado = await servicio.manejarLoginSocial({
      correo: email,
      nombre: name,
      foto: picture
    });

    respuestaExitosa(res, resultado);
  } catch (error) {
    siguiente(error);
  }
}
// --- FIN: NUEVO CONTROLADOR ---

// Listar usuarios (solo admin)
export async function listarUsuarios(req, res, siguiente) {
  try {
    const { limite = 50, desplazamiento = 0 } = req.query;
    const usuarios = await servicio.listarUsuarios(limite, desplazamiento);
    respuestaExitosa(res, usuarios);
  } catch (error) {
    siguiente(error);
  }
}
// Obtener usuario por ID
export async function obtenerUsuario(req, res, siguiente) {
  try {
    const id = Number(req.params.id);
    if (!id) throw { estado: 400, mensaje: 'Id inválido' };

    const usuario = await servicio.obtenerUsuarioPorId(id);
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });

    respuestaExitosa(res, usuario);
  } catch (error) {
    siguiente(error);
  }
}

// Actualizar datos de usuario
export async function actualizarUsuario(req, res, siguiente) {
  try {
    const id = Number(req.params.id);
    if (!id) throw { estado: 400, mensaje: 'Id inválido' };

    const cambios = req.datosValidados;
    const actualizado = await servicio.actualizarUsuario(id, cambios);
    respuestaExitosa(res, actualizado);
  } catch (error) {
    siguiente(error);
  }
}

// Desactivar usuario
export async function desactivarUsuario(req, res, siguiente) {
  try {
    const id = Number(req.params.id);
    if (!id) throw { estado: 400, mensaje: 'Id inválido' };

    const usuario = await servicio.cambiarEstadoUsuario(id, false);
    respuestaExitosa(res, usuario);
  } catch (error) {
    siguiente(error);
  }
}

// Reactivar usuario
export async function reactivarUsuario(req, res, siguiente) {
  try {
    const id = Number(req.params.id);
    if (!id) throw { estado: 400, mensaje: 'Id inválido' };

    const usuario = await servicio.cambiarEstadoUsuario(id, true);
    respuestaExitosa(res, usuario);
  } catch (error) {
    siguiente(error);
  }
}
