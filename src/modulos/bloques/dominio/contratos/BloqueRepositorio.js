/**
 * Contrato (Interfaz) para el Repositorio de Bloques de Contenido.
 */
export default class BloqueRepositorio {
  /**
   * Obtiene la lista de bloques de contenido asociados a un tema.
   * @param {string} temaId
   * @returns {Promise<Bloque[]>}
   */
  obtenerBloquesPorTema(temaId) {
    throw new Error('Método obtenerBloquesPorTema() debe ser implementado');
  }
}
