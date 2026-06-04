import { useState, useCallback } from 'react';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';

/**
 * Hook para gestionar el contenido unificado de un periodo (Vista Estudiante).
 * Llama al endpoint /api/contenido-periodo.
 */
export default function usarContenidoPeriodo() {
  const [contenido, setContenido] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerContenido = useCallback(async (gradoId, periodoId) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteHttp.get(`/contenido-periodo?grado_id=${gradoId}&periodo_id=${periodoId}`);

      if (resultado.error) {
        throw new Error(resultado.mensaje || 'Error desconocido');
      }

      setContenido(resultado.datos);
      return resultado.datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  return {
    contenido,
    cargando,
    error,
    obtenerContenido
  };
}
