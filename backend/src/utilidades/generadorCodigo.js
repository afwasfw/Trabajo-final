// src/utilidades/generadorCodigo.js
export function generarCodigoLicencia() {
  const fecha = new Date();
  const anio = fecha.getFullYear().toString().slice(-2);
  const aleatorio = Math.floor(1000 + Math.random() * 9000);
  return `LIC-${anio}${aleatorio}`;
}
