import { useState, useCallback } from 'react';
import ApiTemaRepositorio from '../../infraestructura/persistencia/ApiTemaRepositorio';
import ObtenerTemasPorPeriodoCasoUso from '../../aplicacion/acciones/ObtenerTemasPorPeriodoCasoUso';
import ObtenerTemaPorIdCasoUso from '../../aplicacion/acciones/ObtenerTemaPorIdCasoUso';

// Instanciar repositorio y casos de uso
const temaRepositorio = new ApiTemaRepositorio();
const casoObtenerTemasPorPeriodo = new ObtenerTemasPorPeriodoCasoUso(temaRepositorio);
const casoObtenerTemaPorId = new ObtenerTemaPorIdCasoUso(temaRepositorio);

/**
 * Hook para gestionar el estado de los Temas Académicos.
 */
export default function usarTemas() {
  const [temas, setTemas] = useState([]);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTemasPorPeriodo = useCallback(async (periodoId) => {
    setCargando(true);
    setError(null);
    try {
      const datos = await casoObtenerTemasPorPeriodo.ejecutar(periodoId);
      setTemas(datos);
      return datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const obtenerTemaPorId = useCallback(async (id) => {
    setCargando(true);
    setError(null);
    try {
      const dato = await casoObtenerTemaPorId.ejecutar(id);
      setTemaSeleccionado(dato);
      return dato;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  return {
    temas,
    temaSeleccionado,
    cargando,
    error,
    obtenerTemasPorPeriodo,
    obtenerTemaPorId
  };
}
