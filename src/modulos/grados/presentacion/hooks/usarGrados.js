import { useState, useCallback } from 'react';
import ApiGradoRepositorio from '../../infraestructura/persistencia/ApiGradoRepositorio';
import ObtenerGradosCasoUso from '../../aplicacion/acciones/ObtenerGradosCasoUso';
import ObtenerGradoPorIdCasoUso from '../../aplicacion/acciones/ObtenerGradoPorIdCasoUso';

// Instanciar repositorio y casos de uso como singletons locales
const gradoRepositorio = new ApiGradoRepositorio();
const casoObtenerGrados = new ObtenerGradosCasoUso(gradoRepositorio);
const casoObtenerGradoPorId = new ObtenerGradoPorIdCasoUso(gradoRepositorio);

/**
 * Hook para gestionar el estado de los Grados.
 */
export default function usarGrados() {
  const [grados, setGrados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerGrados = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await casoObtenerGrados.ejecutar();
      setGrados(datos);
      return datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const obtenerGradoPorId = useCallback(async (id) => {
    setCargando(true);
    setError(null);
    try {
      const dato = await casoObtenerGradoPorId.ejecutar(id);
      setGradoSeleccionado(dato);
      return dato;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  return {
    grados,
    gradoSeleccionado,
    cargando,
    error,
    obtenerGrados,
    obtenerGradoPorId
  };
}
