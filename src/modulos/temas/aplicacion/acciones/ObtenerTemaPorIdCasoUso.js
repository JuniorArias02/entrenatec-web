/**
 * Caso de Uso: Obtener Tema por ID.
 * Recupera un tema específico.
 */
export default class ObtenerTemaPorIdCasoUso {
  constructor(temaRepositorio) {
    this.temaRepositorio = temaRepositorio;
  }

  async ejecutar(id) {
    if (!id) throw new Error('El ID del tema es requerido');
    return await this.temaRepositorio.obtenerTemaPorId(id);
  }
}
