import React, { useState } from 'react';
import { Award, CheckCircle } from 'lucide-react';
import { Alerta } from '@/compartido/utilidades/Alerta';

/**
 * Renderizador para bloques de tipo ACTIVIDAD.
 */
export default function ActividadRenderizador({ bloque }) {
  const [respuesta, setRespuesta] = useState('');
  const [entregado, setEntregado] = useState(false);
  const titulo = bloque.contenido || 'Actividad Práctica Escrita';
  const instruccion = bloque.propiedades?.instruccion || '';

  const manejarEntrega = (e) => {
    e.preventDefault();
    if (!respuesta.trim()) {
      Alerta.advertencia('Atencion.exe', 'Por favor, escribe una respuesta antes de entregar.');
      return;
    }
    setEntregado(true);
  };

  return (
    <div className="w-full bg-white border-2 border-negro shadow-retro p-1 mb-6 max-w-2xl">
      <div className="bg-azul-secundario text-white px-3 py-1 text-xs font-mono font-bold flex justify-between items-center border-b-2 border-negro select-none">
        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-celeste" />
          <span>TAREA_ENTREGABLE.EXE</span>
        </div>
        <span className="text-[10px] bg-white text-azul-secundario px-1.5 border border-black uppercase font-bold">
          {entregado ? 'COMPLETADO' : 'PENDIENTE'}
        </span>
      </div>

      <div className="p-4 bg-gray-50 flex flex-col gap-4 border-t border-gray-200">
        <div>
          <h3 className="font-bold text-base text-azul-oscuro uppercase mt-0 mb-1">{titulo}</h3>
          <p className="text-xs text-gray-600 font-mono select-none">Instrucciones:</p>
          <p className="text-sm text-gray-700 bg-white border border-gray-300 p-3 rounded-sm leading-relaxed mt-1 font-medium shadow-[inset_1px_1px_2px_0px_rgba(0,0,0,0.05)]">
            {instruccion}
          </p>
        </div>

        {entregado ? (
          <div className="bg-emerald-50 border-2 border-green-700 p-4 text-center flex flex-col items-center gap-2 animate-fade-in shadow-retro-sm">
            <CheckCircle className="w-10 h-10 text-green-700" />
            <h4 className="font-bold text-green-800 uppercase text-sm font-mono mt-1">¡ENTREGA SUBIDA CON ÉXITO!</h4>
            <p className="text-xs text-green-700 max-w-md">
              Tu respuesta ha sido registrada y guardada de forma segura en los servidores locales. Tu docente podrá calificar tu envío en el panel de control.
            </p>
            <button 
              onClick={() => {
                setEntregado(false);
                setRespuesta('');
              }}
              className="mt-2 bg-white text-green-800 border-2 border-green-700 px-4 py-1.5 font-bold font-mono text-xs uppercase hover:bg-green-100 active:translate-y-0.5 cursor-pointer"
            >
              Editar Entrega
            </button>
          </div>
        ) : (
          <form onSubmit={manejarEntrega} className="flex flex-col gap-3">
            <label className="text-xs font-mono text-gray-600 select-none">
              Tu respuesta o código de solución:
            </label>
            <textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Ingresa tu respuesta detallada aquí..."
              rows={4}
              className="w-full bg-white border-2 border-negro p-3 font-sans text-sm text-azul-oscuro outline-none focus:ring-1 focus:ring-azul-secundario shadow-[inset_2px_2px_0px_0px_#e5e7eb]"
            />
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-celeste text-negro border-2 border-negro px-6 py-2.5 font-bold text-xs uppercase shadow-retro hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-retro-sm transition-all cursor-pointer"
              >
                ENVIAR AL DOCENTE (+50 EXP)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
