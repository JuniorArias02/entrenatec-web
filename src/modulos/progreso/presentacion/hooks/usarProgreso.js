import { useState, useCallback, useEffect } from 'react';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';

/**
 * Genera o recupera el UUID del estudiante desde el localStorage.
 */
export function obtenerOcrearUUID() {
  let uuid = localStorage.getItem('estudiante_uuid');
  if (!uuid) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      uuid = crypto.randomUUID();
    } else {
      // Fallback simple
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    localStorage.setItem('estudiante_uuid', uuid);
  }
  return uuid;
}

export default function usarProgreso() {
  const [temasCompletados, setTemasCompletados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  
  const uuid = obtenerOcrearUUID();

  const obtenerProgreso = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteHttp.get(`/progreso/estudiante/${uuid}`);
      
      if (resultado.error) {
        throw new Error(resultado.mensaje || 'Error desconocido');
      }
      
      setTemasCompletados(resultado.datos || []);
      return resultado.datos;
    } catch (e) {
      setError(e.message);
      // Fallback silencioso
      setTemasCompletados([]);
    } finally {
      setCargando(false);
    }
  }, [uuid]);

  const marcarTemaCompletado = useCallback(async (temaId) => {
    try {
      const resultado = await clienteHttp.post('/progreso/temas', {
        estudiante_uuid: uuid,
        tema_id: temaId
      });
      
      if (resultado.error) {
        throw new Error(resultado.mensaje || 'Error al marcar el tema como completado');
      }
      
      // Actualizamos el estado local por si acaso
      setTemasCompletados(prev => {
        if (!prev.includes(temaId)) return [...prev, temaId];
        return prev;
      });
      
      return true;
    } catch (e) {
      console.error('Error guardando progreso:', e);
      return false;
    }
  }, [uuid]);

  return {
    temasCompletados,
    cargando,
    error,
    obtenerProgreso,
    marcarTemaCompletado,
    uuid
  };
}
