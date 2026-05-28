/**
 * Contrato (Interfaz) para el Repositorio de Periodos.
 */
export default class PeriodoRepositorio {
  /**
   * Obtiene la lista de periodos filtrada por grado.
   * @param {string} gradoId
   * @returns {Promise<Periodo[]>}
   */
  obtenerPeriodosPorGrado(gradoId) {
    throw new Error('Método obtenerPeriodosPorGrado() debe ser implementado');
  }

  /**
   * Obtiene un periodo por su ID.
   * @param {string} id
   * @returns {Promise<Periodo|null>}
   */
  obtenerPeriodoPorId(id) {
    throw new Error('Método obtenerPeriodoPorId() debe ser implementado');
  }
}
