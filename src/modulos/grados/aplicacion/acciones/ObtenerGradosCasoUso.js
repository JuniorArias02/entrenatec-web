/**
 * Caso de Uso: Obtener Grados.
 * Orquesta la recuperación de todos los niveles académicos del sistema.
 */
export default class ObtenerGradosCasoUso {
  constructor(gradoRepositorio) {
    this.gradoRepositorio = gradoRepositorio;
  }

  async ejecutar() {
    return await this.gradoRepositorio.obtenerGrados();
  }
}
