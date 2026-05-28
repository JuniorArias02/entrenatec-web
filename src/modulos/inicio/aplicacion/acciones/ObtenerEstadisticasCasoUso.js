/**
 * Caso de Uso: Obtener Estadísticas
 * Orquesta la lógica para recuperar las estadísticas del estudiante.
 */
export default class ObtenerEstadisticasCasoUso {
  constructor(estadisticasRepositorio) {
    this.estadisticasRepositorio = estadisticasRepositorio;
  }

  /**
   * Ejecuta el caso de uso.
   * @returns {Promise<Estadisticas>}
   */
  async ejecutar() {
    return await this.estadisticasRepositorio.obtenerEstadisticas();
  }
}
