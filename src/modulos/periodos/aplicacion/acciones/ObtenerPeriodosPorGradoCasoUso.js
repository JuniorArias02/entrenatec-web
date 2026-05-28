/**
 * Caso de Uso: Obtener Periodos por Grado.
 * Recupera los periodos académicos correspondientes a un grado seleccionado.
 */
export default class ObtenerPeriodosPorGradoCasoUso {
  constructor(periodoRepositorio) {
    this.periodoRepositorio = periodoRepositorio;
  }

  async ejecutar(gradoId) {
    if (!gradoId) throw new Error('El ID del grado es requerido');
    return await this.periodoRepositorio.obtenerPeriodosPorGrado(gradoId);
  }
}
