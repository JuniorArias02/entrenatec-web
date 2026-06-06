import { useState, useCallback } from 'react';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';

export default function usarGestorQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const [opciones, setOpciones] = useState({
    grados: [],
    periodos: [],
    materias: [],
    temas: []
  });

  const cargarQuizzes = useCallback(async (filtros = {}) => {
    setCargando(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
          queryParams.append(key, filtros[key]);
        }
      });
      const url = queryParams.toString() ? `/quizzes?${queryParams.toString()}` : '/quizzes';
      const resultado = await clienteHttp.get(url);
      if (resultado.error) throw new Error(resultado.mensaje || 'Error al cargar quizzes');
      setQuizzes(resultado.datos || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarQuizCompleto = useCallback(async (id) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteHttp.get(`/quizzes/${id}`);
      if (resultado.error) throw new Error(resultado.mensaje || 'Error al cargar el quiz');
      return resultado.datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const crearQuiz = useCallback(async (datosQuiz) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteHttp.post('/quizzes', datosQuiz);
      if (resultado.error) throw new Error(resultado.mensaje || 'Error al crear quiz');
      return resultado.datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const agregarPreguntaAQuiz = useCallback(async (quizId, datosPregunta) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteHttp.post(`/quizzes/${quizId}/preguntas`, datosPregunta);
      if (resultado.error) throw new Error(resultado.mensaje || 'Error al agregar pregunta');
      return resultado.datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const actualizarPregunta = useCallback(async (preguntaId, datosPregunta) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteHttp.put(`/preguntas/${preguntaId}`, datosPregunta);
      if (resultado.error) throw new Error(resultado.mensaje || 'Error al actualizar pregunta');
      return resultado.datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const eliminarPregunta = useCallback(async (preguntaId) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteHttp.delete(`/preguntas/${preguntaId}`);
      if (resultado.error) throw new Error(resultado.mensaje || 'Error al eliminar pregunta');
      return true;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const evaluarQuiz = useCallback(async (quizId, respuestas) => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await clienteHttp.post(`/quizzes/${quizId}/evaluar`, { respuestas });
      if (resultado.error) throw new Error(resultado.mensaje || 'Error al evaluar quiz');
      return resultado.datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarOpciones = useCallback(async () => {
    try {
      const [resGrados, resPeriodos, resMaterias, resTemas] = await Promise.all([
        clienteHttp.get('/grados'),
        clienteHttp.get('/periodos'),
        clienteHttp.get('/materias'),
        clienteHttp.get('/temas')
      ]);

      setOpciones({
        grados: resGrados.datos || [],
        periodos: resPeriodos.datos || [],
        materias: resMaterias.datos || [],
        temas: resTemas.datos || []
      });
    } catch (error) {
      console.error('Error cargando opciones para quizzes', error);
    }
  }, []);

  return {
    quizzes,
    cargando,
    error,
    opciones,
    cargarQuizzes,
    cargarQuizCompleto,
    crearQuiz,
    agregarPreguntaAQuiz,
    actualizarPregunta,
    eliminarPregunta,
    evaluarQuiz,
    cargarOpciones
  };
}
