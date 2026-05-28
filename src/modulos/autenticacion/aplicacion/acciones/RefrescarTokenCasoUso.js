/**
 * Caso de Uso: Refrescar Token.
 * Se encarga de solicitar un nuevo token de sesión si la sesión activa está por expirar.
 */
export default class RefrescarTokenCasoUso {
  constructor(autenticacionRepositorio) {
    this.autenticacionRepositorio = autenticacionRepositorio;
  }

  /**
   * Ejecuta el caso de uso.
   * @returns {Promise<Sesion>}
   */
  async ejecutar() {
    const sesionActual = await this.autenticacionRepositorio.obtenerSesion();
    if (!sesionActual || !sesionActual.token) {
      throw new Error('No hay ninguna sesión activa en el almacenamiento local.');
    }
    const nuevaSesion = await this.autenticacionRepositorio.refrescarToken(sesionActual.token);
    await this.autenticacionRepositorio.guardarSesion(nuevaSesion);
    return nuevaSesion;
  }
}
