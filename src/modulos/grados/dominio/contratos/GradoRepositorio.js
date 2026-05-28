/**
 * Contrato (Interfaz) para el Repositorio de Grados.
 */
export default class GradoRepositorio {
  /**
   * Obtiene la lista de todos los grados.
   * @returns {Promise<Grado[]>}
   */
  obtenerGrados() {
    throw new Error('Método obtenerGrados() debe ser implementado');
  }

  /**
   * Obtiene un grado por su ID.
   * @param {string} id
   * @returns {Promise<Grado|null>}
   */
  obtenerGradoPorId(id) {
    throw new Error('Método obtenerGradoPorId() debe ser implementado');
  }
}
