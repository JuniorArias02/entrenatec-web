/**
 * Contrato (Interfaz) para el Repositorio de Estadísticas
 */
export default class EstadisticasRepositorio {
  /**
   * Obtiene las estadísticas actuales del estudiante.
   * @returns {Promise<Estadisticas>}
   */
  obtenerEstadisticas() {
    throw new Error('Método obtenerEstadisticas() debe ser implementado');
  }
}
