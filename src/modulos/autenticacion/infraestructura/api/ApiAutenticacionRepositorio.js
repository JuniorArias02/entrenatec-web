import AutenticacionRepositorio from '../../dominio/contratos/AutenticacionRepositorio';
import Sesion from '../../dominio/entidades/Sesion';

/**
 * Implementación del repositorio de autenticación conectado al servidor API.
 */
export default class ApiAutenticacionRepositorio extends AutenticacionRepositorio {
  constructor() {
    super();
    // Obtener la URL del backend desde las variables de entorno de Vite o usar valor por defecto
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api';
  }

  /**
   * Realiza la solicitud de inicio de sesión con correo y contraseña.
   * @param {string} correo
   * @param {string} contrasena
   * @returns {Promise<Sesion>}
   */
  async iniciarSesion(correo, contrasena) {
    const respuesta = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        correo,
        password: contrasena, // La API de Laravel valida 'password'
      }),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok || resultado.error) {
      throw new Error(resultado.mensaje || 'Credenciales incorrectas o error en el servidor.');
    }

    const { token, tipo_token, expira_en } = resultado.datos;
    return new Sesion({
      token,
      tipoToken: tipo_token,
      expiraEn: expira_en,
      guardadoEn: Date.now(),
    });
  }

  /**
   * Refresca la sesión utilizando el token de sesión actual.
   * @param {string} tokenActual
   * @returns {Promise<Sesion>}
   */
  async refrescarToken(tokenActual) {
    const respuesta = await fetch(`${this.baseUrl}/auth/refrescar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${tokenActual}`,
      },
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok || resultado.error) {
      throw new Error(resultado.mensaje || 'Error al refrescar el token de sesión.');
    }

    const { token, tipo_token, expira_en } = resultado.datos;
    return new Sesion({
      token,
      tipoToken: tipo_token,
      expiraEn: expira_en,
      guardadoEn: Date.now(),
    });
  }

  /**
   * Almacena la sesión de manera persistente en LocalStorage.
   * @param {Sesion} sesion
   */
  guardarSesion(sesion) {
    localStorage.setItem('entrenatech_sesion', JSON.stringify({
      token: sesion.token,
      tipoToken: sesion.tipoToken,
      expiraEn: sesion.expiraEn,
      guardadoEn: sesion.guardadoEn,
    }));
  }

  /**
   * Recupera la sesión almacenada en LocalStorage.
   * @returns {Sesion|null}
   */
  obtenerSesion() {
    const datos = localStorage.getItem('entrenatech_sesion');
    if (!datos) return null;
    try {
      const objeto = JSON.parse(datos);
      return new Sesion(objeto);
    } catch (e) {
      this.eliminarSesion();
      return null;
    }
  }

  /**
   * Elimina la sesión almacenada en LocalStorage.
   */
  eliminarSesion() {
    localStorage.removeItem('entrenatech_sesion');
  }
}
