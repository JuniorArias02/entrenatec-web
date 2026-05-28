/**
 * Entidad de Dominio Tema.
 * Representa una unidad temática o tema de estudio en un periodo específico.
 */
export default class Tema {
  constructor({ id, periodoId, nombre, descripcion, orden }) {
    this.id = id;
    this.periodoId = periodoId;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.orden = orden; // Orden de visualización del tema
  }
}
