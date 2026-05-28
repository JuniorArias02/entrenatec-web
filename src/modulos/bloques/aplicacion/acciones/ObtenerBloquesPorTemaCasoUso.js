/**
 * Caso de Uso: Obtener Bloques por Tema.
 * Recupera el listado estructurado de bloques de contenido asociados a un tema.
 */
export default class ObtenerBloquesPorTemaCasoUso {
  constructor(bloqueRepositorio) {
    this.bloqueRepositorio = bloqueRepositorio;
  }

  async ejecutar(temaId) {
    if (!temaId) throw new Error('El ID del tema es requerido');
    return await this.bloqueRepositorio.obtenerBloquesPorTema(temaId);
  }
}
