import { useState, useEffect } from 'react';
import MemoriaEstadisticasRepositorio from '../../infraestructura/persistencia/MemoriaEstadisticasRepositorio';
import ObtenerEstadisticasCasoUso from '../../aplicacion/acciones/ObtenerEstadisticasCasoUso';

/**
 * Hook personalizado para manejar el estado de la página de Inicio.
 * Ejecuta el caso de uso y expone el estado de carga y datos.
 */
export default function usarInicio() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      try {
        const repositorio = new MemoriaEstadisticasRepositorio();
        const casoUso = new ObtenerEstadisticasCasoUso(repositorio);
        const resultado = await casoUso.ejecutar();
        
        if (activo) {
          setEstadisticas(resultado);
        }
      } catch (err) {
        if (activo) {
          setError(err.message || 'Error al cargar datos de inicio');
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarDatos();

    return () => {
      activo = false;
    };
  }, []);

  return {
    estadisticas,
    cargando,
    error
  };
}
