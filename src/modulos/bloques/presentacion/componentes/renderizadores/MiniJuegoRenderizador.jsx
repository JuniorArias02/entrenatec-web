import React, { useState, useEffect } from 'react';
import { Gamepad2, ArrowUp, ArrowDown, Sparkles, CheckSquare } from 'lucide-react';

/**
 * Renderizador para bloques de tipo MINIJUEGO.
 */
export default function MiniJuegoRenderizador({ bloque }) {
  const titulo = bloque.propiedades?.titulo || 'Minijuego Didáctico';
  const instrucciones = bloque.propiedades?.instrucciones || 'Ordena los siguientes pasos correctamente:';
  const pasosCorrectos = bloque.propiedades?.pasosCorrectos || [];
  const pasosIniciales = bloque.propiedades?.pasosDesordenados || [];

  const [listaPasos, setListaPasos] = useState([]);
  const [comprobado, setComprobado] = useState(false);
  const [esGanador, setEsGanador] = useState(false);

  // Inicializar juego
  useEffect(() => {
    setListaPasos([...pasosIniciales]);
    setComprobado(false);
    setEsGanador(false);
  }, [pasosIniciales]);

  const subirPaso = (idx) => {
    if (idx === 0) return;
    const nuevaLista = [...listaPasos];
    const temp = nuevaLista[idx];
    nuevaLista[idx] = nuevaLista[idx - 1];
    nuevaLista[idx - 1] = temp;
    setListaPasos(nuevaLista);
    setComprobado(false);
  };

  const bajarPaso = (idx) => {
    if (idx === listaPasos.length - 1) return;
    const nuevaLista = [...listaPasos];
    const temp = nuevaLista[idx];
    nuevaLista[idx] = nuevaLista[idx + 1];
    nuevaLista[idx + 1] = temp;
    setListaPasos(nuevaLista);
    setComprobado(false);
  };

  const verificarSolucion = () => {
    const ganado = listaPasos.every((paso, index) => paso === pasosCorrectos[index]);
    setEsGanador(ganado);
    setComprobado(true);
  };

  const reiniciarJuego = () => {
    setListaPasos([...pasosIniciales]);
    setComprobado(false);
    setEsGanador(false);
  };

  return (
    <div className="w-full bg-white border-2 border-negro shadow-retro p-1 mb-6 max-w-2xl bg-checkerboard">
      <div className="bg-azul-secundario text-white px-3 py-1 text-xs font-mono font-bold flex justify-between items-center border-b-2 border-negro select-none">
        <div className="flex items-center gap-1.5">
          <Gamepad2 className="w-4 h-4 text-celeste" />
          <span>MINIJUEGO_EDUCATIVO.EXE</span>
        </div>
        <span className="text-[10px] bg-white text-azul-secundario px-1.5 border border-black uppercase font-bold">
          JUEGO
        </span>
      </div>

      <div className="p-4 bg-white border border-t-0 border-black m-1 shadow-retro-sm">
        <h3 className="font-extrabold text-sm text-azul-oscuro uppercase mt-0 mb-1">{titulo}</h3>
        <p className="text-xs text-gray-600 font-mono select-none">Objetivo:</p>
        <p className="text-xs text-gray-700 bg-gray-100 border border-dashed border-gray-400 p-2.5 rounded-sm mt-1 leading-relaxed font-semibold">
          {instrucciones}
        </p>

        {/* Lista de pasos del juego */}
        <div className="flex flex-col gap-2 mt-4">
          {listaPasos.map((paso, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between border-2 border-negro p-2 bg-white text-xs font-semibold shadow-retro-sm transition-all ${
                comprobado 
                  ? (paso === pasosCorrectos[idx] ? 'border-green-700 bg-green-50' : 'border-red-700 bg-red-50')
                  : 'border-negro'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="bg-azul-oscuro text-white text-[9px] font-mono font-bold w-5 h-5 flex items-center justify-center shrink-0 border border-black select-none">
                  {idx + 1}
                </span>
                <span className="text-gray-800 break-all">{paso}</span>
              </div>
              
              {!comprobado && (
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => subirPaso(idx)}
                    disabled={idx === 0}
                    className="p-1 bg-white border border-black hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Subir paso"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => bajarPaso(idx)}
                    disabled={idx === listaPasos.length - 1}
                    className="p-1 bg-white border border-black hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Bajar paso"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Retroalimentación final */}
        {comprobado && (
          <div className="mt-4 animate-fade-in">
            {esGanador ? (
              <div className="bg-green-100 border-2 border-green-700 p-4 text-center flex flex-col items-center gap-2 shadow-retro-sm">
                <Sparkles className="w-8 h-8 text-green-700 animate-bounce" />
                <h4 className="font-extrabold text-green-800 uppercase text-xs font-mono">¡CÓDIGO COMPILADO CON ÉXITO! (+100 EXP)</h4>
                <p className="text-[11px] text-green-700 font-medium">
                  Excelente razonamiento lógico. Has ordenado las instrucciones en la secuencia exacta. ¡Sigue así!
                </p>
              </div>
            ) : (
              <div className="bg-red-100 border-2 border-red-700 p-4 text-center flex flex-col items-center gap-2 shadow-retro-sm">
                <h4 className="font-extrabold text-red-800 uppercase text-xs font-mono">ERROR EN TIEMPO DE COMPILACIÓN</h4>
                <p className="text-[11px] text-red-700 font-medium">
                  El algoritmo ingresado no ejecuta la tarea esperada. Revisa el flujo lógico de las variables y vuelve a intentarlo.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end mt-4">
          <button
            type="button"
            onClick={reiniciarJuego}
            className="bg-white text-negro border-2 border-negro px-4 py-2 font-bold font-mono text-xs uppercase shadow-retro hover:bg-gray-50 active:translate-y-0.5 cursor-pointer"
          >
            Reiniciar
          </button>
          
          {!esGanador && (
            <button
              type="button"
              onClick={verificarSolucion}
              className="bg-celeste text-negro border-2 border-negro px-5 py-2 font-bold font-mono text-xs uppercase shadow-retro hover:bg-azul-secundario hover:text-white active:translate-y-0.5 cursor-pointer"
            >
              VERIFICAR SOLUCIÓN
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
