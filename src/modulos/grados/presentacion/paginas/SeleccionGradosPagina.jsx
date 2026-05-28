import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usarGrados from '../hooks/usarGrados';
import { Cpu, Monitor, Terminal as TerminalIcon, FolderOpen, ArrowRight } from 'lucide-react';

const ICONOS_MAPA = {
  Cpu: Cpu,
  Monitor: Monitor,
  Terminal: TerminalIcon
};

export default function SeleccionGradosPagina() {
  const navigate = useNavigate();
  const { grados, cargando, error, obtenerGrados } = usarGrados();

  useEffect(() => {
    obtenerGrados();
  }, [obtenerGrados]);

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-12 select-none">
        <div className="bg-white border-2 border-negro shadow-retro p-4 font-mono text-xs uppercase animate-pulse">
          Cargando Grados Curriculares...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-negro p-4 text-center max-w-md mx-auto my-6 font-mono text-xs text-red-800">
        [X] Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in">
      {/* Cabecera */}
      <div className="bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center gap-2 font-mono text-xs uppercase">
          <FolderOpen className="w-4 h-4 text-celeste" />
          <span>Explorador_Grados.exe</span>
        </div>
        <div className="p-6 bg-white">
          <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0">
            Grados de Media Técnica
          </h1>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            Selecciona tu nivel académico actual para ingresar al plan de estudio y comenzar tu entrenamiento técnico en computación y desarrollo de software.
          </p>
        </div>
      </div>

      {/* Grid de Grados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {grados.map((grado) => {
          const IconoComp = ICONOS_MAPA[grado.icono] || Monitor;
          return (
            <div 
              key={grado.id}
              className="bg-white border-2 border-negro shadow-retro flex flex-col justify-between hover:bg-gray-50 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-retro-sm transition-all p-1"
            >
              <div className="bg-azul-secundario text-white px-3 py-1 flex items-center justify-between font-mono text-[10px] uppercase font-bold border-b border-black">
                <span>SECCIÓN_GRADO_{grado.id.toUpperCase()}</span>
                <span>[ ] X</span>
              </div>
              
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="w-12 h-12 bg-celeste border-2 border-negro flex items-center justify-center shadow-retro-sm text-negro shrink-0">
                  <IconoComp className="w-6 h-6" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold uppercase text-azul-oscuro mb-1">
                    {grado.nombre}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {grado.descripcion}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button
                  onClick={() => navigate(`/grados/${grado.id}/periodos`)}
                  className="bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  INGRESAR
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
