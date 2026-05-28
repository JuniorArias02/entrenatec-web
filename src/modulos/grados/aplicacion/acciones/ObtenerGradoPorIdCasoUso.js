/**
 * Caso de Uso: Obtener Grado por ID.
 * Recupera un grado académico específico.
 */
export default class ObtenerGradoPorIdCasoUso {
  constructor(gradoRepositorio) {
    this.gradoRepositorio = gradoRepositorio;
  }

  async ejecutar(id) {
    if (!id) throw new Error('El ID del grado es requerido');
    return await this.gradoRepositorio.obtenerGradoPorId(id);
  }
}
