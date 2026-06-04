import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Monitor, HardDrive, Terminal, Menu } from 'lucide-react';
import { NOMBRE_SISTEMA, VERSION_SISTEMA } from '@/compartido/constantes/version';

export default function BarraNavegacion({ toggleMenu }) {
  const location = useLocation();
  const [rutaSimulada, setRutaSimulada] = useState('C:\\EntrenaTec\\Inicio');
  const [hora, setHora] = useState('');

  // Actualizar la ruta simulada según el path real
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setRutaSimulada('C:\\EntrenaTec\\Inicio');
    } else {
      const formateado = path
        .split('/')
        .filter(Boolean)
        .map(segmento => segmento.charAt(0).toUpperCase() + segmento.slice(1))
        .join('\\');
      setRutaSimulada(`C:\\EntrenaTec\\${formateado || 'Inicio'}`);
    }
  }, [location]);

  // Reloj digital retro
  useEffect(() => {
    const actualizarHora = () => {
      const ahora = new Date();
      const horas = String(ahora.getHours()).padStart(2, '0');
      const minutos = String(ahora.getMinutes()).padStart(2, '0');
      const segundos = String(ahora.getSeconds()).padStart(2, '0');
      setHora(`${horas}:${minutos}:${segundos}`);
    };
    actualizarHora();
    const interval = setInterval(actualizarHora, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full flex flex-col border-b-4 border-negro bg-azul-oscuro text-white select-none">
      {/* Barra superior de título - Estilo Ventana de Windows */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-azul-secundario border-b-2 border-negro">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-celeste" />
          <span className="font-bold tracking-wider text-sm uppercase">
            {NOMBRE_SISTEMA} v{VERSION_SISTEMA}
          </span>
        </div>
        
        {/* Controles de Ventana retro */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={toggleMenu}
            className="md:hidden w-6 h-6 bg-gris-claro text-negro border-2 border-white border-r-gray-500 border-b-gray-500 flex items-center justify-center font-bold font-mono shadow-[1px_1px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button className="hidden md:flex w-5 h-5 bg-gris-claro text-negro border-2 border-white border-r-gray-500 border-b-gray-500 items-center justify-center text-xs font-bold font-mono shadow-[1px_1px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none cursor-pointer">
            _
          </button>
          <button className="hidden md:flex w-5 h-5 bg-gris-claro text-negro border-2 border-white border-r-gray-500 border-b-gray-500 items-center justify-center text-[10px] font-bold font-mono shadow-[1px_1px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none cursor-pointer">
            [ ]
          </button>
          <button className="hidden md:flex w-5 h-5 bg-red-500 text-white border-2 border-red-300 border-r-red-800 border-b-red-800 items-center justify-center text-xs font-bold font-mono shadow-[1px_1px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none cursor-pointer">
            X
          </button>
        </div>
      </div>

      {/* Barra de menú y dirección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-2 gap-2 bg-azul-oscuro">
        {/* Menú de Opciones */}
        <div className="flex items-center gap-4 text-sm font-semibold pl-1">
          <div className="relative group cursor-pointer hover:bg-azul-secundario px-2 py-0.5 border border-transparent hover:border-white">
            <span className="text-celeste">A</span>rchivo
          </div>
          <Link to="/temas/crear" className="relative group cursor-pointer hover:bg-azul-secundario px-2 py-0.5 border border-transparent hover:border-white">
            <span className="text-celeste">N</span>uevo Tema
          </Link>
          <div className="relative group cursor-pointer hover:bg-azul-secundario px-2 py-0.5 border border-transparent hover:border-white">
            <span className="text-celeste">V</span>er
          </div>
          <div className="relative group cursor-pointer hover:bg-azul-secundario px-2 py-0.5 border border-transparent hover:border-white">
            <span className="text-celeste">A</span>yuda
          </div>
        </div>

        {/* Dirección Simulada (Address Bar) */}
        <div className="flex flex-1 items-center gap-2 max-w-xl bg-white text-negro border-2 border-negro px-2 py-1 text-sm font-mono shadow-[inset_2px_2px_0px_0px_#cbd5e1]">
          <span className="text-gray-500 flex items-center gap-1 select-none">
            <HardDrive className="w-4 h-4 text-azul-secundario" />
            Ruta:
          </span>
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {rutaSimulada}
          </span>
        </div>

        {/* Reloj y Estado */}
        <div className="flex items-center gap-3 bg-gray-800 border border-gray-600 px-3 py-1 font-mono text-xs text-celeste shadow-[inset_1px_1px_0px_0px_#000000] rounded-sm justify-between md:justify-start">
          <div className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>ESTADO: ONLINE</span>
          </div>
          <span className="border-l border-gray-600 h-3 mx-1 hidden md:inline"></span>
          <span>{hora}</span>
        </div>
      </div>
    </header>
  );
}
