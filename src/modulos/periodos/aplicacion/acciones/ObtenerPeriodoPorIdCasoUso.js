/**
 * Caso de Uso: Obtener Periodo por ID.
 * Recupera un periodo académico específico.
 */
export default class ObtenerPeriodoPorIdCasoUso {
  constructor(periodoRepositorio) {
    this.periodoRepositorio = periodoRepositorio;
  }

  async ejecutar(id) {
    if (!id) throw new Error('El ID del periodo es requerido');
    return await this.periodoRepositorio.obtenerPeriodoPorId(id);
  }
}
