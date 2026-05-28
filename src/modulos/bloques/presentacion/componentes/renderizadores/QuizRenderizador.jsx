import React, { useState } from 'react';
import { HelpCircle, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

/**
 * Renderizador para bloques de tipo QUIZ.
 */
export default function QuizRenderizador({ bloque }) {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [validado, setValidado] = useState(false);
  
  const pregunta = bloque.propiedades?.pregunta || 'Pregunta sin definir';
  const opciones = bloque.propiedades?.opciones || [];
  const respuestaCorrecta = bloque.propiedades?.respuestaCorrecta ?? 0;
  const explicacion = bloque.propiedades?.explicacion || '';

  const esCorrecto = opcionSeleccionada === respuestaCorrecta;

  const manejarValidar = (e) => {
    e.preventDefault();
    if (opcionSeleccionada === null) {
      alert('Por favor, selecciona una opción antes de responder.');
      return;
    }
    setValidado(true);
  };

  const reiniciarQuiz = () => {
    setOpcionSeleccionada(null);
    setValidado(false);
  };

  return (
    <div className="w-full bg-white border-2 border-negro shadow-retro p-1 mb-6 max-w-2xl">
      <div className="bg-azul-oscuro text-white px-3 py-1 text-xs font-mono font-bold flex justify-between items-center border-b-2 border-negro select-none">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-celeste" />
          <span>CUESTIONARIO_EXPRES.DAT</span>
        </div>
        <span className="text-[10px] bg-celeste text-negro px-1.5 border border-black uppercase font-bold">
          EVALUACIÓN
        </span>
      </div>

      <div className="p-4 bg-gray-50 flex flex-col gap-4 border-t border-gray-200">
        <div>
          <h3 className="font-bold text-sm text-azul-oscuro leading-relaxed mt-0 mb-3">{pregunta}</h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {opciones.map((opc, idx) => {
            const esSeleccionado = opcionSeleccionada === idx;
            let botonClase = 'bg-white border-2 border-negro hover:bg-gray-100 text-azul-oscuro';
            
            if (validado) {
              if (idx === respuestaCorrecta) {
                // Correcta
                botonClase = 'bg-green-100 text-green-800 border-2 border-green-700 font-bold';
              } else if (esSeleccionado) {
                // Seleccionada incorrecta
                botonClase = 'bg-red-100 text-red-800 border-2 border-red-700 line-through';
              } else {
                botonClase = 'bg-white border border-gray-300 text-gray-400 cursor-not-allowed';
              }
            } else if (esSeleccionado) {
              botonClase = 'bg-celeste text-negro border-2 border-negro shadow-retro-sm translate-x-0.5 translate-y-0.5';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={validado}
                onClick={() => setOpcionSeleccionada(idx)}
                className={`w-full text-left p-3 text-xs font-medium transition-all duration-75 flex items-center gap-3 cursor-pointer ${botonClase}`}
              >
                <span className="bg-azul-oscuro text-white text-[9px] font-mono font-bold w-5 h-5 flex items-center justify-center shrink-0 border border-black">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opc}</span>
              </button>
            );
          })}
        </div>

        {validado ? (
          <div className="mt-2 flex flex-col gap-3 animate-fade-in">
            {esCorrecto ? (
              <div className="bg-emerald-50 border-2 border-green-700 p-3 flex items-start gap-2.5 text-green-800 font-medium">
                <CheckCircle className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold uppercase text-xs font-mono">¡Respuesta Correcta! (+30 EXP)</h4>
                  <p className="text-[11px] leading-normal mt-1">{explicacion}</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border-2 border-red-700 p-3 flex items-start gap-2.5 text-red-800 font-medium">
                <XCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold uppercase text-xs font-mono">Respuesta Incorrecta</h4>
                  <p className="text-[11px] leading-normal mt-1">{explicacion}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={reiniciarQuiz}
                className="bg-white text-negro border-2 border-negro px-4 py-1.5 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-gray-100 active:translate-y-0.5 cursor-pointer"
              >
                Reintentar Pregunta
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={manejarValidar}
              className="bg-celeste text-negro border-2 border-negro px-5 py-2 font-bold font-mono text-xs uppercase shadow-retro hover:bg-azul-secundario hover:text-white active:translate-y-0.5 cursor-pointer"
            >
              VALIDAR RESPUESTA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
