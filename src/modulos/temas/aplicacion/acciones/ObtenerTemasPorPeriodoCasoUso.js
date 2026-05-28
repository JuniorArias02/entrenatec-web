/**
 * Caso de Uso: Obtener Temas por Periodo.
 * Recupera la lista de temas asociados a un periodo específico.
 */
export default class ObtenerTemasPorPeriodoCasoUso {
  constructor(temaRepositorio) {
    this.temaRepositorio = temaRepositorio;
  }

  async ejecutar(periodoId) {
    if (!periodoId) throw new Error('El ID del periodo es requerido');
    return await this.temaRepositorio.obtenerTemasPorPeriodo(periodoId);
  }
}
