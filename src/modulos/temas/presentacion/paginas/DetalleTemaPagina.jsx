import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import usarTemas from '../hooks/usarTemas';
import usarProgreso from '@/modulos/progreso/presentacion/hooks/usarProgreso';
import RenderizadorBloques from '@/modulos/bloques/presentacion/componentes/RenderizadorBloques';
import { ArrowLeft, Monitor, BookOpen } from 'lucide-react';

export default function DetalleTemaPagina() {
  const { temaId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { temaSeleccionado, obtenerTemaPorId, cargando, error } = usarTemas();
  const { marcarTemaCompletado } = usarProgreso();

  // Buscar URL de retorno en el estado, o retornar por defecto a grados
  const urlRetorno = location.state?.dePeriodo || '/grados';

  const handleCompletar = async () => {
    if (temaId) {
      await marcarTemaCompletado(parseInt(temaId));
    }
    navigate(urlRetorno);
  };

  useEffect(() => {
    if (temaId) {
      obtenerTemaPorId(temaId);
    }
  }, [temaId, obtenerTemaPorId]);

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-12 select-none">
        <div className="bg-white border-2 border-negro shadow-retro p-4 font-mono text-xs uppercase animate-pulse">
          Ejecutando Compilador de Bloques...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-negro p-4 text-center max-w-md mx-auto my-6 font-mono text-xs text-red-800">
        [X] Error cargando bloques de tema: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in">
      {/* Botón de Retorno */}
      <div>
        <Link 
          to={urlRetorno}
          className="bg-white text-negro border-2 border-negro px-3 py-1.5 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-gray-100 active:translate-y-0.5 active:shadow-none inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Periodo
        </Link>
      </div>

      {/* Cabecera del Tema */}
      <div className="bg-white border-2 border-negro shadow-retro p-1 select-none">
        <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center gap-2 font-mono text-xs uppercase">
          <Monitor className="w-4 h-4 text-celeste" />
          <span>Visor_Tema_Activo.exe</span>
        </div>
        <div className="p-5 bg-white border-t border-gray-300">
          <span className="text-[10px] font-bold font-mono text-azul-secundario uppercase">Tema Escolar</span>
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase text-azul-oscuro m-0 mt-0.5">
            {temaSeleccionado?.titulo || 'Tema de Aprendizaje'}
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Ubicación del archivo: C:\EntrenaTec\Temas\{temaId}.json
          </p>
        </div>
      </div>

      {/* Sección del Renderizador de Bloques */}
      <div className="bg-white border-2 border-negro shadow-retro p-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <RenderizadorBloques bloques={temaSeleccionado?.bloques || []} />
        </div>
      </div>

      {/* Botón de tema completado / retornar al final */}
      <div className="flex justify-between items-center bg-gray-50 border-2 border-negro p-4 shadow-retro-sm">
        <span className="text-xs font-mono font-bold text-gray-500 select-none">
          ¿Terminaste de estudiar este tema?
        </span>
        <button
          onClick={handleCompletar}
          className="bg-celeste text-negro border-2 border-negro px-5 py-2 font-bold font-mono text-xs uppercase shadow-retro hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-retro-sm transition-all cursor-pointer"
        >
          MARCAR TEMARIO COMPLETADO
        </button>
      </div>
    </div>
  );
}
