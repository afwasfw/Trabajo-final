// src/servicios/usuarios.servicio.js
import bd from '../configuracion/baseDatos.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import registro from '../configuracion/registro.js';
import { entorno } from '../configuracion/entorno.js';

const SALTOS = 10;

// Crear usuario
export async function crearUsuario(datos) {
  const existente = await bd('usuarios').where({ correo: datos.correo }).first();
  if (existente) throw { estado: 400, mensaje: 'El correo ya está registrado' };

  const hash = await bcrypt.hash(datos.contrasena, SALTOS);

  const usuario = await bd.transaction(async (trx) => {
    const [idNuevoUsuario] = await trx('usuarios').insert({
      nombre_completo: datos.nombre,
      dni: datos.dni,
      correo: datos.correo,
      contrasena: hash,
      telefono: datos.telefono,
      direccion: datos.direccion,
      id_rol: await obtenerIdRol(datos.rol_nombre, trx)
    });

    const nuevoUsuario = await trx('usuarios')
      .select('id_usuario', 'nombre_completo as nombre', 'correo', 'id_rol', 'activo')
      .where({ id_usuario: idNuevoUsuario })
      .first();
      
    return nuevoUsuario;
  });

  registro.info({ msg: 'Usuario registrado', id: usuario.id_usuario });
  return usuario;
}

// Iniciar sesión
export async function iniciarSesion({ correo, contrasena }) {
  const usuario = await bd('usuarios')
    .join('roles', 'usuarios.id_rol', 'roles.id_rol')
    .select('usuarios.*', 'roles.nombre_rol as rol_nombre')
    .where({ correo })
    .first();

  if (!usuario) throw { estado: 401, mensaje: 'Credenciales inválidas' };

  const valida = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!valida) throw { estado: 401, mensaje: 'Credenciales inválidas' };
  if (!usuario.activo) throw { estado: 403, mensaje: 'Usuario desactivado' };

  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      rol_nombre: usuario.rol_nombre,
      correo: usuario.correo,
      nombre: usuario.nombre_completo
    },
    entorno.jwt.secreto,
    { expiresIn: entorno.jwt.expiracion }
  );

  registro.info({ msg: 'Usuario inició sesión', id: usuario.id_usuario });
  return { token, usuario: limpiarUsuario(usuario) };
}

// --- INICIO: NUEVA FUNCIÓN PARA MANEJAR LOGIN SOCIAL ---
export async function manejarLoginSocial({ correo, nombre, foto }) {
  // 1. Buscar si el usuario ya existe en nuestra base de datos
  let usuario = await bd('usuarios')
    .join('roles', 'usuarios.id_rol', 'roles.id_rol')
    .select('usuarios.*', 'roles.nombre_rol as rol_nombre')
    .where('usuarios.correo', correo)
    .first();

  if (!usuario) {
    // 2. Si no existe, lo creamos
    registro.info({ msg: 'Creando nuevo usuario desde login social', correo });

    const [idNuevoUsuario] = await bd('usuarios').insert({
      nombre_completo: nombre,
      correo: correo,
      id_rol: 3, // Rol de Ciudadano por defecto
      // La contraseña, dni, telefono, etc., quedan como NULL
    });

    usuario = await bd('usuarios')
      .join('roles', 'usuarios.id_rol', 'roles.id_rol')
      .select('usuarios.*', 'roles.nombre_rol as rol_nombre')
      .where('usuarios.id_usuario', idNuevoUsuario)
      .first();
  }

  // 3. Generar nuestro propio token JWT para el usuario (existente o nuevo)
  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      rol_nombre: usuario.rol_nombre,
      correo: usuario.correo,
      nombre: usuario.nombre_completo,
      foto: foto // Podemos incluir la foto de perfil en el token
    },
    entorno.jwt.secreto,
    { expiresIn: entorno.jwt.expiracion }
  );

  registro.info({ msg: 'Usuario inició sesión vía Google', id: usuario.id_usuario });
  return { token, usuario: limpiarUsuario(usuario) };
}
// --- FIN: NUEVA FUNCIÓN ---

// Listar usuarios
export async function listarUsuarios(limit = 50, offset = 0) {
  return bd('usuarios')
    .join('roles', 'usuarios.id_rol', 'roles.id_rol')
    .select(
      'usuarios.id_usuario',
      'usuarios.nombre_completo as nombre',
      'usuarios.correo',
      'roles.nombre_rol as rol',
      'usuarios.activo',
      'usuarios.fecha_creacion'
    )
    .orderBy('usuarios.id_usuario')
    .limit(Number(limit))
    .offset(Number(offset));
}

// Obtener usuario por ID
export async function obtenerUsuarioPorId(id) {
  const usuario = await bd('usuarios')
    .join('roles', 'usuarios.id_rol', 'roles.id_rol')
    .select(
      'usuarios.id_usuario',
      'usuarios.nombre_completo as nombre',
      'usuarios.correo',
      'roles.nombre_rol as rol_nombre',
      'usuarios.activo'
    )
    .where('usuarios.id_usuario', id)
    .first();

  return usuario || null;
}

// Actualizar usuario
export async function actualizarUsuario(id, cambios) {
  const usuario = await bd('usuarios').where({ id_usuario: id }).first();
  if (!usuario) throw { estado: 404, mensaje: 'Usuario no encontrado' };

  const actualizados = { ...cambios };
  if (cambios.contrasena) {
    actualizados.contrasena = await bcrypt.hash(cambios.contrasena, SALTOS);
  }
  if (actualizados.nombre) {
    actualizados.nombre_completo = actualizados.nombre;
    delete actualizados.nombre;
  }

  const resultado = await bd.transaction(async (trx) => {
    await trx.raw('SET LOCAL app.user_id = ?', [id]);
    const count = await trx('usuarios')
      .where({ id_usuario: id })
      .update(actualizados);

    if (count === 0) return null;

    return trx('usuarios')
      .select('id_usuario', 'nombre_completo as nombre', 'correo', 'activo')
      .where({ id_usuario: id })
      .first();
  });

  registro.info({ msg: 'Usuario actualizado', id });
  return resultado;
}

// Activar o desactivar usuario
export async function cambiarEstadoUsuario(id, activo = true) {
  const usuario = await bd.transaction(async (trx) => {
    await trx.raw('SET LOCAL app.user_id = ?', [id]);
    const count = await trx('usuarios')
      .where({ id_usuario: id })
      .update({ activo });
    
    if (count === 0) return null;

    return trx('usuarios')
      .select('id_usuario', 'nombre_completo as nombre', 'correo', 'activo')
      .where({ id_usuario: id })
      .first();
  });

  if (!usuario) throw { estado: 404, mensaje: 'Usuario no encontrado' };
  registro.info({ msg: `Usuario ${activo ? 'reactivado' : 'desactivado'}`, id });
  return usuario;
}

// Utilidad: obtener ID de rol
async function obtenerIdRol(nombreRol, trx = bd) {
  const rol = await trx('roles').where({ nombre_rol: nombreRol }).first();
  if (!rol) throw { estado: 400, mensaje: 'Rol no válido' };
  return rol.id_rol;
}

// Utilidad: limpiar objeto usuario
function limpiarUsuario(usuario) {
  const limpio = { ...usuario };
  delete limpio.contrasena;
  return limpio;
}
