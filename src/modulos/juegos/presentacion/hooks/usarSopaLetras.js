import { useState, useCallback } from 'react';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';

export default function usarSopaLetras() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const crearSopaLetras = useCallback(async (datosSopa) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteHttp.post('/sopa-letras', datosSopa);
      if (resultado.error) throw new Error(resultado.mensaje || 'Error al crear la sopa de letras');
      return resultado.datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const obtenerSopaLetras = useCallback(async (id) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteHttp.get(`/sopa-letras/${id}`);
      if (resultado.error) throw new Error(resultado.mensaje || 'Error al cargar la sopa de letras');
      return resultado.datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const evaluarSopaLetras = useCallback(async (id, datosEvaluacion) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteHttp.post(`/sopa-letras/${id}/evaluar`, datosEvaluacion);
      if (resultado.error) throw new Error(resultado.mensaje || 'Error al evaluar el juego');
      return resultado.datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  return {
    cargando,
    error,
    crearSopaLetras,
    obtenerSopaLetras,
    evaluarSopaLetras
  };
}
