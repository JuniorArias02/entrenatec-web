import { useState, useEffect } from 'react';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';
import { obtenerOcrearUUID } from '@/modulos/progreso/presentacion/hooks/usarProgreso';

export default function usarInicio() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [estadisticasAdmin, setEstadisticasAdmin] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { sesion } = usarAutenticacion();

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      try {
        const rol = sesion?.rol || 'ESTUDIANTE';
        
        if (rol === 'ESTUDIANTE') {
          const uuid = obtenerOcrearUUID();
          const resultado = await clienteHttp.get(`/progreso/estudiante/${uuid}/dashboard`);
          if (resultado && !resultado.error && activo) {
            setEstadisticas(resultado.datos);
          }
        } else {
          // Es ADMIN o DOCENTE/EDITOR
          const resultadoAdmin = await clienteHttp.get('/dashboard/estadisticas');
          if (resultadoAdmin && !resultadoAdmin.error) {
            if (activo) setEstadisticasAdmin(resultadoAdmin.datos);
          }
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
  }, [sesion?.rol]);

  return {
    estadisticas,
    estadisticasAdmin,
    cargando,
    error
  };
}
