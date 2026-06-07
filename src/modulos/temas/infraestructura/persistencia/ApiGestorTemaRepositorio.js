import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';

export default class ApiGestorTemaRepositorio {
  async crearTemaBasico(datosTema) {
    const formData = new FormData();
    Object.keys(datosTema).forEach(key => {
      if (datosTema[key] !== null && datosTema[key] !== undefined && datosTema[key] !== '') {
        formData.append(key, datosTema[key]);
      }
    });

    const resultado = await clienteHttp.post('/temas', formData);
    if (resultado.error) {
      throw new Error(resultado.mensaje || 'Error al crear el tema base.');
    }
    return resultado.datos;
  }

  async sincronizarBloques(temaId, bloques) {
    const resultado = await clienteHttp.post(`/temas/${temaId}/bloques`, { bloques });
    if (resultado.error) {
      throw new Error(resultado.mensaje || 'Error al sincronizar los bloques.');
    }
    return resultado.datos;
  }

  async subirArchivo(archivo) {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const resultado = await clienteHttp.post('/archivos', formData);
    if (resultado.error) {
      throw new Error(resultado.mensaje || 'Error al subir archivo.');
    }
    return resultado.datos; 
  }

  async subirGaleria(archivos) {
    const formData = new FormData();
    Array.from(archivos).forEach(archivo => {
      formData.append('imagenes[]', archivo);
    });

    const resultado = await clienteHttp.post('/archivos/galeria', formData);
    if (resultado.error) {
      throw new Error(resultado.mensaje || 'Error al subir galería.');
    }
    return resultado.datos;
  }

  async obtenerTodosLosTemas(filtros = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        queryParams.append(key, filtros[key]);
      }
    });

    const url = queryParams.toString() ? `/temas?${queryParams.toString()}` : '/temas';
    const resultado = await clienteHttp.get(url);
    if (resultado.error) {
      throw new Error(resultado.mensaje || 'Error al obtener los temas en el gestor.');
    }
    return resultado.datos; 
  }

  async obtenerTemaConBloques(temaId) {
    const resultado = await clienteHttp.get(`/temas/${temaId}`);
    if (resultado.error) {
      throw new Error(resultado.mensaje || 'Error al obtener el detalle del tema.');
    }
    return resultado.datos;
  }

  async actualizarEstadoTema(temaId, estado) {
    const resultado = await clienteHttp.put(`/temas/${temaId}`, { estado });
    if (resultado.error) {
      throw new Error(resultado.mensaje || 'Error al actualizar el estado del tema.');
    }
    return resultado.datos; 
  }
}
