import { useState, useCallback } from 'react';
import ApiGestorTemaRepositorio from '../../infraestructura/persistencia/ApiGestorTemaRepositorio';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';

const repositorio = new ApiGestorTemaRepositorio();

export default function usarConstructorTema() {
  const [temas, setTemas] = useState([]);
  const [temaBase, setTemaBase] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [paso, setPaso] = useState(0); // 0 = Gestor de Temas (Listado), 1 = Formulario Básico, 2 = Constructor Visual

  const [opciones, setOpciones] = useState({
    grados: [],
    periodos: [],
    materias: []
  });

  const cargarTemas = useCallback(async (filtros = {}) => {
    setCargando(true);
    setError(null);
    try {
      const datos = await repositorio.obtenerTodosLosTemas(filtros);
      setTemas(datos);
      return datos;
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarTemaParaEditar = useCallback(async (temaId) => {
    setCargando(true);
    setError(null);
    try {
      const datos = await repositorio.obtenerTemaConBloques(temaId);
      setTemaBase({
        id: datos.id,
        titulo: datos.titulo,
        descripcion: datos.descripcion,
        grado_id: datos.grado_id,
        periodo_id: datos.periodo_id,
        materia_id: datos.materia_id,
        portada: datos.portada,
        orden: datos.orden,
        estado: datos.estado
      });
      
      // Asignar keys temporales para la UI de React a cada bloque
      const bloquesConKeys = (datos.bloques || []).map((b, i) => ({
        ...b,
        _uiId: Date.now() + i
      }));
      
      setBloques(bloquesConKeys);
      setPaso(2);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const iniciarNuevoTema = useCallback(() => {
    setTemaBase(null);
    setBloques([]);
    setPaso(1);
  }, []);

  const crearTema = useCallback(async (datosTema) => {
    setCargando(true);
    setError(null);
    try {
      const datos = await repositorio.crearTemaBasico(datosTema);
      setTemaBase(datos); // { id: ... }
      setPaso(2);
      return datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const guardarBloques = useCallback(async (temaId, bloquesAGuardar) => {
    setCargando(true);
    setError(null);
    try {
      await repositorio.sincronizarBloques(temaId, bloquesAGuardar);
      setBloques(bloquesAGuardar);
      // Podríamos mostrar una notificación de éxito aquí
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const subirArchivo = useCallback(async (archivo) => {
    setCargando(true);
    setError(null);
    try {
      return await repositorio.subirArchivo(archivo);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarOpciones = useCallback(async () => {
    try {
      const [resGrados, resPeriodos, resMaterias] = await Promise.all([
        clienteHttp.get('/grados'),
        clienteHttp.get('/periodos'),
        clienteHttp.get('/materias')
      ]);

      setOpciones({
        grados: resGrados.datos || [],
        periodos: resPeriodos.datos || [],
        materias: resMaterias.datos || []
      });
    } catch (error) {
      console.error('Error cargando opciones de selects', error);
    }
  }, []);

  const cambiarEstadoTema = useCallback(async (temaId, nuevoEstado) => {
    setCargando(true);
    setError(null);
    try {
      const datos = await repositorio.actualizarEstadoTema(temaId, nuevoEstado);
      setTemas(prev => prev.map(t => t.id === temaId ? { ...t, estado: datos.estado } : t));
      if (temaBase?.id === temaId) {
        setTemaBase(prev => prev ? { ...prev, estado: datos.estado } : null);
      }
      return datos;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, [temaBase]);

  return {
    temas,
    temaBase,
    bloques,
    cargando,
    error,
    paso,
    opciones,
    setPaso,
    setBloques,
    cargarTemas,
    cargarTemaParaEditar,
    iniciarNuevoTema,
    crearTema,
    guardarBloques,
    subirArchivo,
    cargarOpciones,
    cambiarEstadoTema
  };
}
