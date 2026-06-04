import React, { useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import usarContenidoPeriodo from '../hooks/usarContenidoPeriodo';
import usarProgreso from '@/modulos/progreso/presentacion/hooks/usarProgreso';
import GestorCuadroTeorico from '../componentes/GestorCuadroTeorico';
import { ArrowLeft, BookOpen, Layers, Award, Terminal, CheckCircle2 } from 'lucide-react';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';
import { Alerta } from '@/compartido/utilidades/Alerta';

export default function DetallePeriodoPagina() {
  const { gradoId, periodoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const periodoNombre = location.state?.periodoNombre || `Periodo ${periodoId}`;

  const { contenido, obtenerContenido, cargando: cargandoContenido, error } = usarContenidoPeriodo();
  const { temasCompletados, obtenerProgreso, cargando: cargandoProgreso } = usarProgreso();

  useEffect(() => {
    obtenerProgreso();
  }, [obtenerProgreso]);

  useEffect(() => {
    if (gradoId && periodoId) {
      obtenerContenido(gradoId, periodoId);
    }
  }, [gradoId, periodoId, obtenerContenido]);

  const cargando = cargandoContenido || cargandoProgreso;

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
            {periodoNombre}
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1 select-none">
            UBICACIÓN: Grado {gradoId} &gt; {periodoId}
          </p>
        </div>
      </div>

      {/* Barra de Progreso General */}
      {contenido?.temas && contenido.temas.length > 0 && (
        <div className="bg-white border-2 border-negro shadow-retro p-4 select-none">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono font-bold text-xs uppercase text-azul-oscuro flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              Tu Progreso del Periodo
            </span>
            <span className="font-mono font-bold text-xs text-gray-600">
              {Math.round((temasCompletados.filter(id => contenido.temas.some(t => t.id === id)).length / contenido.temas.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 border-2 border-negro h-4 relative overflow-hidden">
            <div 
              className="bg-green-500 h-full transition-all duration-500 ease-out border-r-2 border-negro"
              style={{ width: `${Math.round((temasCompletados.filter(id => contenido.temas.some(t => t.id === id)).length / contenido.temas.length) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Cuadro Teórico Pedagógico (Visualización/Edición) */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold uppercase text-azul-oscuro flex items-center gap-2 select-none">
          <span className="w-2.5 h-6 bg-celeste border border-black inline-block"></span>
          Cuadro Teórico Pedagógico
        </h2>
        <GestorCuadroTeorico 
          gradoId={gradoId}
          periodo={{ id: periodoId, cuadroTeorico: contenido?.cuadro_teorico?.contenido }}
          alGuardar={async (payloadGestor) => {
            try {
              const payloadFinal = {
                ...payloadGestor,
                grado_id: parseInt(gradoId, 10),
                materia_id: parseInt(contenido?.cuadro_teorico?.materia_id || 1, 10),
                periodo_id: parseInt(periodoId, 10)
              };

              let res;
              if (contenido?.cuadro_teorico?.id) {
                res = await clienteHttp.put(`/cuadros-teoricos/${contenido.cuadro_teorico.id}`, payloadFinal);
              } else {
                res = await clienteHttp.post('/cuadros-teoricos', payloadFinal);
              }

              if (!res.error) {
                Alerta.exito('Guardado Exitoso', 'Cuadro Teórico guardado correctamente.');
                obtenerContenido(gradoId, periodoId); // Recargar el contenido
              } else {
                Alerta.error('Error', res.mensaje || 'No se pudo guardar el cuadro teórico.');
              }
            } catch (error) {
              Alerta.error('Error', 'Hubo un error al intentar guardar el cuadro teórico.');
            }
          }}
        />
      </div>

      {/* Listado de Temas */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold uppercase text-azul-oscuro flex items-center gap-2 select-none">
          <span className="w-2.5 h-6 bg-celeste border border-black inline-block"></span>
          Temas a Desarrollar
        </h2>

        <div className="flex flex-col gap-4">
          {contenido?.temas?.map((tema) => {
            const completado = temasCompletados.includes(tema.id);
            return (
            <div 
              key={tema.id}
              className={`bg-white border-2 border-negro shadow-retro hover:-translate-y-1 hover:shadow-retro-md transition-all p-1 flex flex-col md:flex-row items-stretch justify-between gap-4 ${completado ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
            >
              <div className="p-4 flex-1 flex gap-3.5 items-start relative">
                {completado && (
                  <div className="absolute top-2 right-2 bg-white rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                )}
                <div className={`font-mono font-bold text-xs w-8 h-8 border border-negro flex items-center justify-center shrink-0 shadow-retro-sm select-none ${completado ? 'bg-green-500 text-white' : 'bg-azul-oscuro text-celeste'}`}>
                  {tema.orden}
                </div>
                <div className="flex-1 flex gap-4 items-center">
                  {tema.portada && (
                    <img src={tema.portada} alt={tema.titulo} className="w-16 h-16 object-cover border-2 border-negro" />
                  )}
                  <div>
                    <h3 className="text-base font-extrabold text-azul-oscuro uppercase tracking-wide">
                      {tema.titulo}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">
                      {tema.descripcion}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:border-l border-t md:border-t-0 border-gray-200 bg-gray-50 flex items-center justify-end md:justify-center shrink-0">
                <button
                  onClick={() => navigate(`/temas/${tema.id}`, { state: { dePeriodo: `/grados/${gradoId}/periodos/${periodoId}` } })}
                  className="bg-celeste text-negro border-2 border-negro px-5 py-2 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  {completado ? 'REPASAR TEMA' : 'ABRIR TEMA'}
                </button>
              </div>
            </div>
            );
          })}
          {(!contenido?.temas || contenido.temas.length === 0) && (
            <div className="bg-white border-2 border-dashed border-negro py-12 text-center text-gray-400 font-mono text-xs select-none">
              No hay unidades temáticas cargadas en este periodo académico.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
