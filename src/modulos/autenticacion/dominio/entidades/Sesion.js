/**
 * Entidad de Dominio Sesion.
 * Representa la sesión activa de un usuario en el sistema.
 */
export default class Sesion {
  constructor({ token, tipoToken, expiraEn, guardadoEn = Date.now(), rol = null }) {
    this.token = token;
    this.tipoToken = tipoToken;
    this.expiraEn = expiraEn; // En segundos, ej. 3600
    this.guardadoEn = guardadoEn; // Marca de tiempo en ms
    this.rol = rol;
  }

  /**
   * Determina si la sesión ha expirado o está cerca de expirar.
   * @returns {boolean} True si ya expiró o expira en menos de 30 segundos
   */
  haExpirado() {
    if (!this.token) return true;
    const tiempoTranscurrido = (Date.now() - this.guardadoEn) / 1000;
    return tiempoTranscurrido >= (this.expiraEn - 30);
  }
}
