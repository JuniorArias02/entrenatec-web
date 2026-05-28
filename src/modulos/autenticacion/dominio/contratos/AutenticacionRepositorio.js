/**
 * Contrato (Interfaz) para el Repositorio de Autenticación.
 */
export default class AutenticacionRepositorio {
  /**
   * Realiza la solicitud de inicio de sesión con correo y contraseña.
   * @param {string} correo
   * @param {string} contrasena
   * @returns {Promise<Sesion>}
   */
  iniciarSesion(correo, contrasena) {
    throw new Error('Método iniciarSesion() debe ser implementado');
  }

  /**
   * Refresca la sesión utilizando el token de sesión actual.
   * @param {string} tokenActual
   * @returns {Promise<Sesion>}
   */
  refrescarToken(tokenActual) {
    throw new Error('Método refrescarToken() debe ser implementado');
  }

  /**
   * Almacena la sesión de manera persistente.
   * @param {Sesion} sesion
   */
  guardarSesion(sesion) {
    throw new Error('Método guardarSesion() debe ser implementado');
  }

  /**
   * Recupera la sesión almacenada.
   * @returns {Sesion|null}
   */
  obtenerSesion() {
    throw new Error('Método obtenerSesion() debe ser implementado');
  }

  /**
   * Elimina la sesión almacenada.
   */
  eliminarSesion() {
    throw new Error('Método eliminarSesion() debe ser implementado');
  }
}
