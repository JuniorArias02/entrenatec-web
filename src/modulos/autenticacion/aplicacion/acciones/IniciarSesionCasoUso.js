/**
 * Caso de Uso: Iniciar Sesión.
 * Orquesta el proceso de autenticación del usuario y almacenamiento de la sesión.
 */
export default class IniciarSesionCasoUso {
  constructor(autenticacionRepositorio) {
    this.autenticacionRepositorio = autenticacionRepositorio;
  }

  /**
   * Ejecuta el caso de uso.
   * @param {string} correo
   * @param {string} contrasena
   * @returns {Promise<Sesion>}
   */
  async ejecutar(correo, contrasena) {
    if (!correo || !contrasena) {
      throw new Error('El correo y la contraseña son requeridos.');
    }
    const sesion = await this.autenticacionRepositorio.iniciarSesion(correo, contrasena);
    await this.autenticacionRepositorio.guardarSesion(sesion);
    return sesion;
  }
}
