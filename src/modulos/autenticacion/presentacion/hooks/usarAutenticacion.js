import { create } from 'zustand';
import ApiAutenticacionRepositorio from '../../infraestructura/api/ApiAutenticacionRepositorio';
import IniciarSesionCasoUso from '../../aplicacion/acciones/IniciarSesionCasoUso';
import RefrescarTokenCasoUso from '../../aplicacion/acciones/RefrescarTokenCasoUso';
import CerrarSesionCasoUso from '../../aplicacion/acciones/CerrarSesionCasoUso';

// Instanciar la infraestructura y casos de uso
const repositorio = new ApiAutenticacionRepositorio();
const iniciarSesionCasoUso = new IniciarSesionCasoUso(repositorio);
const refrescarTokenCasoUso = new RefrescarTokenCasoUso(repositorio);
const cerrarSesionCasoUso = new CerrarSesionCasoUso(repositorio);

/**
 * Tienda global de Zustand para el estado de autenticación.
 */
export const useAuthStore = create((set, get) => ({
  sesion: repositorio.obtenerSesion(),
  cargando: false,
  error: null,

  /**
   * Acción para iniciar sesión.
   * @param {string} correo
   * @param {string} contrasena
   */
  iniciarSesion: async (correo, contrasena) => {
    set({ cargando: true, error: null });
    try {
      const sesion = await iniciarSesionCasoUso.ejecutar(correo, contrasena);
      set({ sesion, cargando: false });
      return sesion;
    } catch (err) {
      set({ error: err.message || 'Error en las credenciales', cargando: false });
      throw err;
    }
  },

  /**
   * Acción para refrescar la sesión activa.
   */
  refrescarSesion: async () => {
    try {
      const nuevaSesion = await refrescarTokenCasoUso.ejecutar();
      set({ sesion: nuevaSesion });
      return nuevaSesion;
    } catch (err) {
      // Si falla el refrescado (ej. expiró de verdad o backend dio error), se cierra sesión
      await cerrarSesionCasoUso.ejecutar();
      set({ sesion: null });
      throw err;
    }
  },

  /**
   * Acción para cerrar la sesión.
   */
  cerrarSesion: async () => {
    set({ cargando: true, error: null });
    try {
      await cerrarSesionCasoUso.ejecutar();
      set({ sesion: null, cargando: false });
    } catch (err) {
      set({ error: err.message, cargando: false });
    }
  },

  /**
   * Determina si el usuario está autenticado y su sesión no ha expirado.
   * @returns {boolean}
   */
  estaAutenticado: () => {
    const sesion = get().sesion;
    if (!sesion) return false;
    return !sesion.haExpirado();
  }
}));

/**
 * Hook personalizado reactivo que expone el estado y acciones de autenticación.
 */
export default function usarAutenticacion() {
  const sesion = useAuthStore((state) => state.sesion);
  const cargando = useAuthStore((state) => state.cargando);
  const error = useAuthStore((state) => state.error);
  const iniciarSesion = useAuthStore((state) => state.iniciarSesion);
  const refrescarSesion = useAuthStore((state) => state.refrescarSesion);
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion);
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);

  return {
    sesion,
    cargando,
    error,
    iniciarSesion,
    refrescarSesion,
    cerrarSesion,
    estaAutenticado: estaAutenticado()
  };
}
