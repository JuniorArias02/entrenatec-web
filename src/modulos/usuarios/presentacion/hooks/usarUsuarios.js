import { useState, useCallback } from 'react';
import ApiUsuariosRepositorio from '../../infraestructura/api/ApiUsuariosRepositorio';

const repositorio = new ApiUsuariosRepositorio();

export default function usarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await repositorio.obtenerUsuarios();
      setUsuarios(datos);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  const crearUsuario = useCallback(async (datosUsuario) => {
    setCargando(true);
    setError(null);
    try {
      const nuevoUsuario = await repositorio.crearUsuario(datosUsuario);
      // Opcional: Podríamos re-fetch de todos los usuarios
      await cargarUsuarios();
      return nuevoUsuario;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, [cargarUsuarios]);

  const cambiarPassword = useCallback(async (id, password) => {
    setCargando(true);
    setError(null);
    try {
      await repositorio.cambiarPassword(id, password);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, []);

  const cambiarRol = useCallback(async (id, rol) => {
    setCargando(true);
    setError(null);
    try {
      await repositorio.cambiarRol(id, rol);
      await cargarUsuarios();
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setCargando(false);
    }
  }, [cargarUsuarios]);

  return {
    usuarios,
    cargando,
    error,
    cargarUsuarios,
    crearUsuario,
    cambiarPassword,
    cambiarRol
  };
}
