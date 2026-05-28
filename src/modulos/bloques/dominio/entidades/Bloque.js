/**
 * Entidad de Dominio Bloque.
 * Representa un bloque de contenido dinámico de un tema de estudio.
 */
export default class Bloque {
  constructor({ id, temaId, tipo, contenido, propiedades = {} }) {
    this.id = id;
    this.temaId = temaId;
    this.tipo = tipo; // e.g. 'TITULO', 'TEXTO', 'IMAGEN', 'QUIZ', etc.
    this.contenido = contenido; // Contenido principal en formato texto/html
    this.propiedades = propiedades; // Otras propiedades adicionales específicas del bloque (ej. urls, opciones, etc.)
  }
}
