/**
 * Caso de Uso: Cerrar Sesión.
 * Elimina la sesión activa de la memoria y almacenamiento del sistema.
 */
export default class CerrarSesionCasoUso {
  constructor(autenticacionRepositorio) {
    this.autenticacionRepositorio = autenticacionRepositorio;
  }

  /**
   * Ejecuta el caso de uso.
   * @returns {Promise<void>}
   */
  async ejecutar() {
    await this.autenticacionRepositorio.eliminarSesion();
  }
}
