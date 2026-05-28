/**
 * Entidad de Dominio Estadisticas
 * Representa las estadísticas de progreso de un estudiante en la plataforma.
 */
export default class Estadisticas {
  constructor({
    temasCompletados,
    temasTotales,
    materiasInscritas,
    horasEstudio,
    nivelActual,
    puntosExperiencia,
    puntosSiguienteNivel
  }) {
    this.temasCompletados = temasCompletados;
    this.temasTotales = temasTotales;
    this.materiasInscritas = materiasInscritas;
    this.horasEstudio = horasEstudio;
    this.nivelActual = nivelActual;
    this.puntosExperiencia = puntosExperiencia;
    this.puntosSiguienteNivel = puntosSiguienteNivel;
  }

  /**
   * Obtiene el porcentaje de avance general.
   * @returns {number} Porcentaje de 0 a 100
   */
  obtenerPorcentajeProgreso() {
    if (this.temasTotales === 0) return 0;
    return Math.round((this.temasCompletados / this.temasTotales) * 100);
  }
}
