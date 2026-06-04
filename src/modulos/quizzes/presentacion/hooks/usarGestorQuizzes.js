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
    crearQuiz,
    cargarOpciones
  };
}
