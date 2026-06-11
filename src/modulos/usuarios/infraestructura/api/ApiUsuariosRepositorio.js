import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';

export default class ApiUsuariosRepositorio {
  /**
   * Obtiene la lista de usuarios.
   */
  async obtenerUsuarios() {
    const respuesta = await clienteHttp.get('/usuarios');
    if (respuesta.error) throw new Error(respuesta.mensaje || 'Error al cargar usuarios');
    return respuesta.datos;
  }

  /**
   * Crea un nuevo usuario.
   */
  async crearUsuario(datosUsuario) {
    const respuesta = await clienteHttp.post('/usuarios', datosUsuario);
    if (respuesta.error) throw new Error(respuesta.mensaje || 'Error al crear usuario');
    return respuesta.datos;
  }

  /**
   * Cambia la contraseña de un usuario.
   */
  async cambiarPassword(id, password) {
    const respuesta = await clienteHttp.put(`/usuarios/${id}/password`, { password });
    if (respuesta.error) throw new Error(respuesta.mensaje || 'Error al cambiar contraseña');
    return respuesta.datos;
  }

  /**
   * Cambia el rol de un usuario.
   */
  async cambiarRol(id, rol) {
    const respuesta = await clienteHttp.put(`/usuarios/${id}/rol`, { rol });
    if (respuesta.error) throw new Error(respuesta.mensaje || 'Error al cambiar rol');
    return respuesta.datos;
  }

  /**
   * Actualiza el perfil (nombre y correo) de un usuario.
   */
  async actualizarPerfil(id, datosPerfil) {
    const respuesta = await clienteHttp.put(`/usuarios/${id}/perfil`, datosPerfil);
    if (respuesta.error) {
      const error = new Error(respuesta.mensaje || 'Error al actualizar el perfil');
      error.erroresValidacion = respuesta.errores;
      throw error;
    }
    return respuesta.datos;
  }
}
