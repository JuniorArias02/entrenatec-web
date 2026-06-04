import GradoRepositorio from '../../dominio/contratos/GradoRepositorio';
import Grado from '../../dominio/entidades/Grado';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';

/**
 * Implementación de API del repositorio de Grados.
 */
export default class ApiGradoRepositorio extends GradoRepositorio {
  async obtenerGrados() {
    try {
      const resultado = await clienteHttp.get('/grados');
      
      if (resultado.error) {
        throw new Error(resultado.mensaje || 'Error desconocido');
      }

      return resultado.datos.map(dato => new Grado({
        id: dato.id,
        nombre: dato.nombre
      }));
    } catch (error) {
      console.error('Error ApiGradoRepositorio:', error);
      throw error;
    }
  }

  async obtenerGradoPorId(id) {
    try {
      const resultado = await clienteHttp.get(`/grados/${id}`);
      
      if (resultado.error) {
        throw new Error(resultado.mensaje || 'Error desconocido');
      }

      const dato = resultado.datos;
      return new Grado({
        id: dato.id,
        nombre: dato.nombre
      });
    } catch (error) {
      console.error(`Error ApiGradoRepositorio obtenerGradoPorId(${id}):`, error);
      throw error;
    }
  }
}
