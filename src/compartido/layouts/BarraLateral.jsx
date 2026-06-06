import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Layers,
  Users,
  FolderOpen,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Edit3,
  Menu,
  HelpCircle,
  Gamepad2
} from 'lucide-react';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';

export default function BarraLateral({ menuMovilAbierto, setMenuMovilAbierto }) {
  const navigate = useNavigate();
  const { sesion, refrescarSesion, cerrarSesion } = usarAutenticacion();
  const [colapsada, setColapsada] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const refrescarEnProgreso = useRef(false);

  useEffect(() => {
    if (!sesion?.token || !sesion?.expiraEn || !sesion?.guardadoEn) return;

    const calcularRestante = () => {
      const limite = sesion.guardadoEn + sesion.expiraEn * 1000;
      return Math.max(0, Math.floor((limite - Date.now()) / 1000));
    };

    setTiempoRestante(calcularRestante());
    refrescarEnProgreso.current = false;

    const intervalo = setInterval(() => {
      const restante = calcularRestante();
      setTiempoRestante(restante);

      // Refrescar automáticamente cuando quedan 60 segundos o menos
      if (restante > 0 && restante <= 60 && !refrescarEnProgreso.current) {
        refrescarEnProgreso.current = true;
        refrescarSesion().catch((e) => {
          console.error('Error al refrescar la sesión automáticamente', e);
          refrescarEnProgreso.current = false;
        });
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [sesion, refrescarSesion]);

  const enlaces = [
    { nombre: 'Inicio', ruta: '/inicio', icono: Home, roles: ['ESTUDIANTE', 'DOCENTE', 'EDITOR', 'ADMIN'] },
    { nombre: 'Plan Curricular', ruta: '/grados', icono: BookOpen, roles: ['ESTUDIANTE', 'DOCENTE', 'EDITOR', 'ADMIN'] },
    { nombre: 'Creador de Temas', ruta: '/temas/crear', icono: Edit3, roles: ['DOCENTE', 'EDITOR', 'ADMIN'] },
    { nombre: 'Gestión de Quizzes', ruta: '/quizzes', icono: HelpCircle, roles: ['DOCENTE', 'EDITOR', 'ADMIN'] },
    { nombre: 'Mis Juegos', ruta: '/juegos', icono: Gamepad2, roles: ['ESTUDIANTE', 'DOCENTE', 'EDITOR', 'ADMIN'] },
    { nombre: 'Mis Evaluaciones', ruta: '/evaluaciones', icono: Layers, roles: ['ESTUDIANTE', 'DOCENTE', 'EDITOR', 'ADMIN'] },
    { nombre: 'Gestión de Usuarios', ruta: '/usuarios', icono: Users, roles: ['ADMIN'] },
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
    <>
      {/* Backdrop oscuro para móvil */}
      {menuMovilAbierto && (
        <div 
          className="absolute inset-0 bg-azul-oscuro/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMenuMovilAbierto(false)}
        ></div>
      )}

      <aside className={`
        absolute md:relative inset-y-0 left-0 z-40 h-full
        transition-transform duration-300 ease-in-out
        ${menuMovilAbierto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-64 ${colapsada ? 'md:w-16' : 'md:w-64'} 
        bg-white border-r-4 border-negro flex flex-col select-none
      `}>
        {/* Cabecera de la Barra Lateral */}
        <div className="bg-azul-oscuro text-white px-4 py-2 border-b-2 border-negro flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <FolderOpen className="w-4 h-4 text-celeste shrink-0" />
            {!colapsada && (
              <span className="font-bold text-xs uppercase tracking-wider font-mono truncate">
                Navegación
              </span>
            )}
          </div>
          <button 
            onClick={() => setColapsada(!colapsada)}
            className="hidden md:block hover:bg-azul-secundario p-1 border border-transparent hover:border-negro transition-all active:translate-y-0.5 rounded cursor-pointer"
            title={colapsada ? "Expandir panel" : "Colapsar panel"}
          >
            {colapsada ? <Menu className="w-3.5 h-3.5 text-celeste" /> : <ChevronLeft className="w-3.5 h-3.5 text-celeste" />}
          </button>
          {/* Botón de cierre en móvil */}
          <button 
            onClick={() => setMenuMovilAbierto(false)}
            className="md:hidden hover:bg-red-600 p-1 border border-transparent hover:border-white transition-all active:translate-y-0.5 rounded cursor-pointer text-white"
          >
            X
          </button>
        </div>

      {/* Lista de Enlaces */}
      <nav className={`flex-1 p-4 flex flex-col gap-3 bg-gray-50 ${colapsada ? 'items-center px-2' : ''}`}>
        {enlaces
          .filter(enlace => !enlace.roles || enlace.roles.includes(sesion?.rol || 'ESTUDIANTE'))
          .map((enlace) => {
          const Icono = enlace.icono;
          return (
            <NavLink
              key={enlace.ruta}
              to={enlace.ruta}
              onClick={() => setMenuMovilAbierto(false)}
              title={colapsada ? enlace.nombre : undefined}
              className={({ isActive }) => `
                flex items-center ${colapsada ? 'justify-center p-2 w-10 h-10' : 'justify-between px-3 py-2.5 w-full'} 
                border-2 border-negro font-bold text-sm tracking-wide transition-all duration-100
                ${isActive
                  ? 'bg-celeste text-negro shadow-[2px_2px_0px_0px_#000000] translate-x-0.5 translate-y-0.5'
                  : 'bg-white text-azul-oscuro shadow-retro hover:bg-gris-claro hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-retro-sm'
                }
              `}
            >
              <div className="flex items-center gap-2.5">
                <Icono className="w-4 h-4 shrink-0 text-azul-secundario" />
                {!colapsada && <span>{enlace.nombre}</span>}
              </div>
              {!colapsada && <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />}
            </NavLink>
          );
        })}

        {/* Botón de Cerrar Sesión */}
        <button
          onClick={manejarCerrarSesion}
          title={colapsada ? "Cerrar Sesión" : undefined}
          className={`flex items-center ${colapsada ? 'justify-center p-2 w-10 h-10' : 'justify-between px-3 py-2.5 w-full'} bg-red-50 text-red-700 border-2 border-negro font-bold text-sm tracking-wide transition-all duration-100 shadow-retro hover:bg-red-600 hover:text-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-retro-sm cursor-pointer mt-1`}
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 shrink-0" />
            {!colapsada && <span>Cerrar Sesión</span>}
          </div>
          {!colapsada && <ChevronRight className="w-4 h-4 shrink-0 text-red-300 group-hover:text-white" />}
        </button>

        {/* Separador Retro */}
        <hr className="border-t-2 border-dashed border-gray-300 my-4 w-full" />

        {/* Sección de Estado Adicional */}
        {!colapsada ? (
          <div className="p-3 bg-gris-claro border-2 border-black border-dashed rounded-sm font-mono text-xs text-azul-oscuro flex flex-col gap-1.5 shadow-[inset_1px_1px_0px_0px_#ffffff] w-full">
            <div className="font-bold border-b border-gray-300 pb-1 text-[11px] text-gray-500 uppercase">
              INFORMACIÓN DE SESIÓN
            </div>
            <div>USUARIO ID: {usuarioId}</div>
            <div>ESTADO: Conectado</div>
            <div>EXPIRACIÓN: {tiempoRestante}s / {sesion?.expiraEn || 3600}s</div>
            <div className="w-full bg-white border border-black h-2.5 mt-1 overflow-hidden relative">
              <div 
                className="bg-celeste h-full border-r border-negro transition-all duration-1000 ease-linear"
                style={{ width: `${sesion?.expiraEn ? (tiempoRestante / sesion.expiraEn) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div 
            className="w-10 h-10 bg-gris-claro border-2 border-black border-dashed flex items-center justify-center relative cursor-help rounded-sm overflow-hidden"
            title={`Sesión expira en: ${tiempoRestante}s`}
          >
            <div className="absolute inset-x-0 bottom-0 bg-celeste transition-all duration-1000 ease-linear" style={{ height: `${sesion?.expiraEn ? (tiempoRestante / sesion.expiraEn) * 100 : 0}%` }}></div>
            <span className="font-mono font-bold text-[9px] z-10 text-azul-oscuro">{tiempoRestante}s</span>
          </div>
        )}
      </nav>

      {/* Pie de la Barra Lateral */}
      <div className={`p-3 bg-gris-claro border-t-2 border-negro text-center text-xs font-mono font-bold text-gray-600 bg-checkerboard ${colapsada ? 'py-4 px-1' : 'py-6'}`}>
        <div className="bg-white border-2 border-black p-2 inline-block shadow-retro-sm font-rajdhani text-sm uppercase text-negro tracking-widest truncate max-w-full">
          {colapsada ? 'ET' : 'ENTRENA TEC'}
        </div>
      </div>
      </aside>
    </>
  );
}
