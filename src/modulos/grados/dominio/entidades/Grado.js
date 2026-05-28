/**
 * Entidad de Dominio Grado.
 * Representa un año escolar o nivel académico (ej. 9°, 10°, 11°).
 */
export default class Grado {
  constructor({ id, nombre, descripcion, icono = 'Monitor' }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.icono = icono;
  }
}
