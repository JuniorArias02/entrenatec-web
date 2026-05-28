import EstadisticasRepositorio from '../../dominio/contratos/EstadisticasRepositorio';
import Estadisticas from '../../dominio/entidades/Estadisticas';

/**
 * Implementación en Memoria del Repositorio de Estadísticas
 * Simula la obtención de datos de una base de datos o API externa.
 */
export default class MemoriaEstadisticasRepositorio extends EstadisticasRepositorio {
  /**
   * Obtiene las estadísticas simuladas de la plataforma.
   * @returns {Promise<Estadisticas>}
   */
  async obtenerEstadisticas() {
    // Simular retraso de red
    await new Promise((resolver) => setTimeout(resolver, 400));
    
    return new Estadisticas({
      temasCompletados: 8,
      temasTotales: 24,
      materiasInscritas: 4,
      horasEstudio: 14,
      nivelActual: 2,
      puntosExperiencia: 250,
      puntosSiguienteNivel: 1000
    });
  }
}
