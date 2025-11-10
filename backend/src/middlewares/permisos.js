// src/middleware/permisos.js

export function verificarRol(...rolesPermitidos) {
  return (req, res, siguiente) => {
    const rol = req.usuario?.rol_nombre;
    if (!rol || !rolesPermitidos.includes(rol)) {
      return res.status(403).json({
        exito: false,
        mensaje: 'Acceso denegado: rol no autorizado'
      });
    }
    siguiente();
  };
}
