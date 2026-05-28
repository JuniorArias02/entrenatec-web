import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Layers,
  Users,
  FolderOpen,
  ChevronRight,
  LogOut
} from 'lucide-react';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';

export default function BarraLateral() {
  const navigate = useNavigate();
  const { sesion, cerrarSesion } = usarAutenticacion();

  const enlaces = [
    { nombre: 'Inicio', ruta: '/inicio', icono: Home },
    { nombre: 'Temas', ruta: '/temas', icono: BookOpen },
    { nombre: 'Materias', ruta: '/materias', icono: Layers },
    { nombre: 'Usuarios', ruta: '/usuarios', icono: Users },
  ];

  // Helper para decodificar los datos básicos del JWT (como el ID de usuario 'sub')
  const obtenerDatosToken = () => {
    if (!sesion?.token) return null;
    try {
      const base64Url = sesion.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const datosToken = obtenerDatosToken();
  const usuarioId = datosToken?.sub || '1';

  const manejarCerrarSesion = async () => {
    await cerrarSesion();
    navigate('/');
  };

  return (
    <aside className="w-full md:w-64 bg-white border-b-4 md:border-b-0 md:border-r-4 border-negro flex flex-col select-none">
      {/* Cabecera de la Barra Lateral */}
      <div className="bg-azul-oscuro text-white px-4 py-2 border-b-2 border-negro flex items-center gap-2">
        <FolderOpen className="w-4 h-4 text-celeste" />
        <span className="font-bold text-xs uppercase tracking-wider font-mono">
          Navegación
        </span>
      </div>

      {/* Lista de Enlaces */}
      <nav className="flex-1 p-4 flex flex-col gap-3 bg-gray-50">
        {enlaces.map((enlace) => {
          const Icono = enlace.icono;
          return (
            <NavLink
              key={enlace.ruta}
              to={enlace.ruta}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2.5 
                border-2 border-negro font-bold text-sm tracking-wide transition-all duration-100
                ${isActive
                  ? 'bg-celeste text-negro shadow-[2px_2px_0px_0px_#000000] translate-x-0.5 translate-y-0.5'
                  : 'bg-white text-azul-oscuro shadow-retro hover:bg-gris-claro hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-retro-sm'
                }
              `}
            >
              <div className="flex items-center gap-2.5">
                <Icono className="w-4 h-4 shrink-0 text-azul-secundario" />
                <span>{enlace.nombre}</span>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
            </NavLink>
          );
        })}

        {/* Botón de Cerrar Sesión */}
        <button
          onClick={manejarCerrarSesion}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-red-50 text-red-700 border-2 border-negro font-bold text-sm tracking-wide transition-all duration-100 shadow-retro hover:bg-red-600 hover:text-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-retro-sm cursor-pointer mt-1"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Cerrar Sesión</span>
          </div>
          <ChevronRight className="w-4 h-4 shrink-0 text-red-300 group-hover:text-white" />
        </button>

        {/* Separador Retro */}
        <hr className="border-t-2 border-dashed border-gray-300 my-4" />

        {/* Sección de Estado Adicional */}
        <div className="p-3 bg-gris-claro border-2 border-black border-dashed rounded-sm font-mono text-xs text-azul-oscuro flex flex-col gap-1.5 shadow-[inset_1px_1px_0px_0px_#ffffff]">
          <div className="font-bold border-b border-gray-300 pb-1 text-[11px] text-gray-500 uppercase">
            INFORMACIÓN DE SESIÓN
          </div>
          <div>USUARIO ID: {usuarioId}</div>
          <div>ESTADO: Conectado</div>
          <div>EXPIRACIÓN: {sesion?.expiraEn ? `${sesion.expiraEn}s` : '3600s'}</div>
          <div className="w-full bg-white border border-black h-2.5 mt-1 overflow-hidden">
            <div className="bg-celeste h-full w-full border-r border-black animate-pulse"></div>
          </div>
        </div>
      </nav>

      {/* Pie de la Barra Lateral */}
      <div className="p-3 bg-gris-claro border-t-2 border-negro text-center text-xs font-mono font-bold text-gray-600 bg-checkerboard py-6">
        <div className="bg-white border-2 border-black p-2 inline-block shadow-retro-sm font-rajdhani text-sm uppercase text-negro tracking-widest">
          ENTRENA TEC        </div>
      </div>
    </aside>
  );
}
