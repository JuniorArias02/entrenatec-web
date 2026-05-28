import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import usarPeriodos from '../hooks/usarPeriodos';
import usarTemas from '@/modulos/temas/presentacion/hooks/usarTemas';
import { ArrowLeft, BookOpen, Layers, Award, Terminal } from 'lucide-react';

export default function DetallePeriodoPagina() {
  const { gradoId, periodoId } = useParams();
  const navigate = useNavigate();

  const { periodoSeleccionado, obtenerPeriodoPorId, cargando: cargandoPeriodo } = usarPeriodos();
  const { temas, obtenerTemasPorPeriodo, cargando: cargandoTemas, error } = usarTemas();

  useEffect(() => {
    if (periodoId) {
      obtenerPeriodoPorId(periodoId);
      obtenerTemasPorPeriodo(periodoId);
    }
  }, [periodoId, obtenerPeriodoPorId, obtenerTemasPorPeriodo]);

  const cargando = cargandoPeriodo || cargandoTemas;

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-12 select-none">
        <div className="bg-white border-2 border-negro shadow-retro p-4 font-mono text-xs uppercase animate-pulse">
          Abriendo Carpeta de Periodo...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-negro p-4 text-center max-w-md mx-auto my-6 font-mono text-xs text-red-800">
        [X] Error cargando temas: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in">
      {/* Botón de Retorno */}
      <div>
        <Link 
          to={`/grados/${gradoId}/periodos`}
          className="bg-white text-negro border-2 border-negro px-3 py-1.5 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-gray-100 active:translate-y-0.5 active:shadow-none inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Periodos
        </Link>
      </div>

      {/* Cabecera del Periodo */}
      <div className="bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1 flex items-center gap-2 font-mono text-xs uppercase">
          <BookOpen className="w-4 h-4 text-celeste" />
          <span>Folleto_Periodo.txt</span>
        </div>
        <div className="p-5 bg-white">
          <span className="text-[10px] font-bold font-mono text-azul-secundario uppercase">Detalle del Periodo</span>
          <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0 mt-1">
            {periodoSeleccionado?.nombre || 'Periodo Académico'}
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1 select-none">
            UBICACIÓN: Grado {gradoId} &gt; {periodoId}
          </p>
        </div>
      </div>

      {/* Cuadro Teórico del Periodo */}
      {periodoSeleccionado?.cuadroTeorico && (
        <div className="bg-white border-2 border-negro shadow-retro p-1">
          <div className="bg-azul-secundario text-white px-3 py-1 flex items-center justify-between font-mono text-[10px] uppercase font-bold border-b border-black">
            <span>MARCO_CONCEPTUAL_TEORICO.SYS</span>
            <span>[ ] X</span>
          </div>
          <div className="p-5 bg-blue-50/50 flex flex-col md:flex-row gap-4 items-start">
            <div className="bg-celeste border-2 border-negro p-3 shadow-retro-sm text-negro shrink-0 select-none">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-azul-oscuro uppercase mt-0 mb-1">
                Introducción Teórica del Periodo
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {periodoSeleccionado.cuadroTeorico}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Listado de Temas */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold uppercase text-azul-oscuro flex items-center gap-2 select-none">
          <span className="w-2.5 h-6 bg-celeste border border-black inline-block"></span>
          Temas a Desarrollar
        </h2>

        <div className="flex flex-col gap-4">
          {temas.map((tema) => (
            <div 
              key={tema.id}
              className="bg-white border-2 border-negro shadow-retro hover:bg-gray-50 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-retro-sm transition-all p-1 flex flex-col md:flex-row items-stretch justify-between gap-4"
            >
              <div className="p-4 flex-1 flex gap-3.5 items-start">
                <div className="bg-azul-oscuro text-celeste font-mono font-bold text-xs w-8 h-8 border border-negro flex items-center justify-center shrink-0 shadow-retro-sm select-none">
                  {tema.orden}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-azul-oscuro uppercase tracking-wide">
                    {tema.nombre}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">
                    {tema.descripcion}
                  </p>
                </div>
              </div>

              <div className="p-4 md:border-l border-t md:border-t-0 border-gray-200 bg-gray-50 flex items-center justify-end md:justify-center shrink-0">
                <button
                  onClick={() => navigate(`/temas/${tema.id}`, { state: { dePeriodo: `/grados/${gradoId}/periodos/${periodoId}` } })}
                  className="bg-celeste text-negro border-2 border-negro px-5 py-2 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  ABRIR TEMA
                </button>
              </div>
            </div>
          ))}
          {temas.length === 0 && (
            <div className="bg-white border-2 border-dashed border-negro py-12 text-center text-gray-400 font-mono text-xs select-none">
              No hay unidades temáticas cargadas en este periodo académico.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
