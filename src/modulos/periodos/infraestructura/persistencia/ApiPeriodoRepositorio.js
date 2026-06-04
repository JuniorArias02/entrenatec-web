import PeriodoRepositorio from '../../dominio/contratos/PeriodoRepositorio';
import Periodo from '../../dominio/entidades/Periodo';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';

/**
 * Implementación de API del repositorio de Periodos.
 */
export default class ApiPeriodoRepositorio extends PeriodoRepositorio {
  async obtenerPeriodosPorGrado(gradoId) {
    try {
      const resultado = await clienteHttp.get('/periodos');
      
      if (resultado.error) {
        throw new Error(resultado.mensaje || 'Error desconocido');
      }

      return resultado.datos.map(dato => new Periodo({
        id: dato.id,
        gradoId: gradoId,
        nombre: dato.nombre || `Periodo ${dato.numero}`,
        descripcion: dato.descripcion || '',
        cuadroTeorico: dato.cuadroTeorico || ''
      }));
    } catch (error) {
      console.error('Error ApiPeriodoRepositorio obtenerPeriodosPorGrado:', error);
      throw error;
    }
  }

  async obtenerPeriodoPorId(id) {
    try {
      const resultado = await clienteHttp.get(`/periodos/${id}`);
      
      if (resultado.error) {
        throw new Error(resultado.mensaje || 'Error desconocido');
      }

      const dato = resultado.datos;
      return new Periodo({
        id: dato.id,
        gradoId: dato.grado_id || dato.gradoId, // Depende de cómo venga del backend
        nombre: dato.nombre || `Periodo ${dato.numero}`,
        descripcion: dato.descripcion || '',
        cuadroTeorico: dato.cuadroTeorico || ''
      });
    } catch (error) {
      console.error(`Error ApiPeriodoRepositorio obtenerPeriodoPorId(${id}):`, error);
      throw error;
    }
  }
}
