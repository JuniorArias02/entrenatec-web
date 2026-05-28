/**
 * Contrato (Interfaz) para el Repositorio de Temas.
 */
export default class TemaRepositorio {
  /**
   * Obtiene la lista de temas filtrada por periodo.
   * @param {string} periodoId
   * @returns {Promise<Tema[]>}
   */
  obtenerTemasPorPeriodo(periodoId) {
    throw new Error('Método obtenerTemasPorPeriodo() debe ser implementado');
  }

  /**
   * Obtiene un tema por su ID.
   * @param {string} id
   * @returns {Promise<Tema|null>}
   */
  obtenerTemaPorId(id) {
    throw new Error('Método obtenerTemaPorId() debe ser implementado');
  }
}
