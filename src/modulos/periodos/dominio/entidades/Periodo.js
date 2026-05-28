/**
 * Entidad de Dominio Periodo.
 * Representa un periodo académico de un grado escolar.
 */
export default class Periodo {
  constructor({ id, gradoId, nombre, descripcion, cuadroTeorico }) {
    this.id = id;
    this.gradoId = gradoId;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.cuadroTeorico = cuadroTeorico; // Resumen o marco conceptual del periodo
  }
}
