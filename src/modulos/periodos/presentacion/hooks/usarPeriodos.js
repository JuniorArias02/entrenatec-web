import { useState, useCallback } from 'react';
import MemoriaPeriodoRepositorio from '../../infraestructura/persistencia/MemoriaPeriodoRepositorio';
import ObtenerPeriodosPorGradoCasoUso from '../../aplicacion/acciones/ObtenerPeriodosPorGradoCasoUso';
import ObtenerPeriodoPorIdCasoUso from '../../aplicacion/acciones/ObtenerPeriodoPorIdCasoUso';

// Instanciar repositorio y casos de uso
const periodoRepositorio = new MemoriaPeriodoRepositorio();
const casoObtenerPeriodosPorGrado = new ObtenerPeriodosPorGradoCasoUso(periodoRepositorio);
const casoObtenerPeriodoPorId = new ObtenerPeriodoPorIdCasoUso(periodoRepositorio);

/**
 * Hook para gestionar el estado de los Periodos Académicos.
 */
export default function usarPeriodos() {
  const [periodos, setPeriodos] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerPeriodosPorGrado = useCallback(async (gradoId) => {
    setCargando(true);
    setError(null);
    try {
      const datos = await casoObtenerPeriodosPorGrado.ejecutar(gradoId);
      setPeriodos(datos);
      return datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const obtenerPeriodoPorId = useCallback(async (id) => {
    setCargando(true);
    setError(null);
    try {
      const dato = await casoObtenerPeriodoPorId.ejecutar(id);
      setPeriodoSeleccionado(dato);
      return dato;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  return {
    periodos,
    periodoSeleccionado,
    cargando,
    error,
    obtenerPeriodosPorGrado,
    obtenerPeriodoPorId
  };
}
