import { useState, useCallback } from 'react';
import MemoriaBloqueRepositorio from '../../infraestructura/persistencia/MemoriaBloqueRepositorio';
import ObtenerBloquesPorTemaCasoUso from '../../aplicacion/acciones/ObtenerBloquesPorTemaCasoUso';

// Instanciar repositorio y caso de uso
const bloqueRepositorio = new MemoriaBloqueRepositorio();
const casoObtenerBloquesPorTema = new ObtenerBloquesPorTemaCasoUso(bloqueRepositorio);

/**
 * Hook para gestionar el estado de los Bloques de Contenido.
 */
export default function usarBloques() {
  const [bloques, setBloques] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerBloquesPorTema = useCallback(async (temaId) => {
    setCargando(true);
    setError(null);
    try {
      const datos = await casoObtenerBloquesPorTema.ejecutar(temaId);
      setBloques(datos);
      return datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  return {
    bloques,
    cargando,
    error,
    obtenerBloquesPorTema
  };
}
