import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import usarPeriodos from '../hooks/usarPeriodos';
import usarGrados from '@/modulos/grados/presentacion/hooks/usarGrados';
import { ArrowLeft, BookOpen, ChevronRight, Folder } from 'lucide-react';

export default function SeleccionPeriodosPagina() {
  const { gradoId } = useParams();
  const navigate = useNavigate();

  const { gradoSeleccionado, obtenerGradoPorId, cargando: cargandoGrado } = usarGrados();
  const { periodos, obtenerPeriodosPorGrado, cargando: cargandoPeriodos, error } = usarPeriodos();

  useEffect(() => {
    if (gradoId) {
      obtenerGradoPorId(gradoId);
      obtenerPeriodosPorGrado(gradoId);
    }
  }, [gradoId, obtenerGradoPorId, obtenerPeriodosPorGrado]);

  const cargando = cargandoGrado || cargandoPeriodos;

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-12 select-none">
        <div className="bg-white border-2 border-negro shadow-retro p-4 font-mono text-xs uppercase animate-pulse">
          Cargando Plan Curricular...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-negro p-4 text-center max-w-md mx-auto my-6 font-mono text-xs text-red-800">
        [X] Error cargando periodos: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in">
      {/* Botón de Retorno */}
      <div>
        <Link 
          to="/grados"
          className="bg-white text-negro border-2 border-negro px-3 py-1.5 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-gray-100 active:translate-y-0.5 active:shadow-none inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Grados
        </Link>
      </div>

      {/* Cabecera del Grado */}
      <div className="bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1 flex items-center gap-2 font-mono text-xs uppercase">
          <BookOpen className="w-4 h-4 text-celeste" />
          <span>Ficha_Grado.ini</span>
        </div>
        <div className="p-5 bg-white">
          <span className="text-[10px] font-bold font-mono text-azul-secundario uppercase">Plan de Estudios</span>
          <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0 mt-1">
            {gradoSeleccionado?.nombre || 'Grado Escolar'}
          </h1>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            {gradoSeleccionado?.descripcion || 'Definición de temarios y competencias técnicas.'}
          </p>
        </div>
      </div>

      {/* Listado de Periodos */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold uppercase text-azul-oscuro flex items-center gap-2 select-none">
          <span className="w-2.5 h-6 bg-celeste border border-black inline-block"></span>
          Periodos Académicos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {periodos.map((periodo, idx) => (
            <div 
              key={periodo.id}
              className="bg-white border-2 border-negro shadow-retro flex flex-col justify-between hover:bg-gray-50 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-retro-sm transition-all p-1"
            >
              <div className="bg-azul-secundario text-white px-3 py-1 flex items-center justify-between font-mono text-[10px] uppercase font-bold border-b border-black">
                <span>PERIODO_{idx + 1}_INDEX.SYS</span>
                <span>[ ] X</span>
              </div>

              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-yellow-100 border border-yellow-400 p-1.5 shrink-0 select-none">
                    <Folder className="w-5 h-5 text-yellow-600 fill-current" />
                  </div>
                  <h3 className="text-lg font-bold text-azul-oscuro uppercase">
                    {periodo.nombre}
                  </h3>
                </div>
                
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {periodo.descripcion}
                </p>
              </div>

              <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button
                  onClick={() => navigate(`/grados/${gradoId}/periodos/${periodo.id}`)}
                  className="bg-celeste text-negro border-2 border-negro px-4 py-1.5 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 cursor-pointer"
                >
                  VER CONTENIDOS
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {periodos.length === 0 && (
            <div className="col-span-full bg-white border-2 border-dashed border-negro py-12 text-center text-gray-400 font-mono text-xs select-none">
              No hay periodos académicos registrados para este grado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
