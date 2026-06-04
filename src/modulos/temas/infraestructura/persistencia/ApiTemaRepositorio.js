import TemaRepositorio from '../../dominio/contratos/TemaRepositorio';
import Tema from '../../dominio/entidades/Tema';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';

/**
 * Implementación de API del repositorio de Temas (Lectura Estudiante).
 */
export default class ApiTemaRepositorio extends TemaRepositorio {
  async obtenerTemasPorPeriodo(periodoId) {
    // Esto ya se maneja en el endpoint unificado, pero si se usa de forma aislada:
    return [];
  }

  async obtenerTemaPorId(id) {
    try {
      const resultado = await clienteHttp.get(`/temas/${id}`);
      
      if (resultado.error) {
        throw new Error(resultado.mensaje || 'Error desconocido');
      }

      const dato = resultado.datos;
      const tema = new Tema({
        id: dato.id,
        titulo: dato.titulo,
        descripcion: dato.descripcion,
        periodoId: dato.periodo_id,
        materiaId: dato.materia_id,
        gradoId: dato.grado_id,
        slug: dato.slug,
        portada: dato.portada,
        orden: dato.orden,
        estado: dato.estado
      });

      // Adjuntar los bloques tal cual vienen del backend
      tema.bloques = dato.bloques || [];
      
      return tema;
    } catch (error) {
      console.error(`Error ApiTemaRepositorio obtenerTemaPorId(${id}):`, error);
      throw error;
    }
  }
}
