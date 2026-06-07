import React from 'react';
import { ArrowRight, HelpCircle } from 'lucide-react';

/**
 * Renderizador para bloques de tipo LISTA.
 */
export default function ListaRenderizador({ bloque }) {
  const elementos = bloque.propiedades?.elementos || bloque.metadata?.elementos || [];
  const ordenada = bloque.propiedades?.ordenada ?? bloque.metadata?.ordenada ?? false;
  const titulo = bloque.contenido;

  return (
    <div className="w-full bg-white border-2 border-negro p-4 shadow-retro-sm mb-4">
      {titulo && (
        <div className="font-bold text-azul-oscuro text-sm mb-3 uppercase flex items-center gap-1.5 border-b border-gray-300 pb-1.5 select-none">
          <HelpCircle className="w-4 h-4 text-azul-secundario shrink-0" />
          <span>{titulo}</span>
        </div>
      )}

      {ordenada ? (
        <ol className="flex flex-col gap-2.5 list-none m-0 p-0">
          {elementos.map((elm, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="bg-azul-secundario text-white font-mono font-bold text-[10px] w-5 h-5 flex items-center justify-center shrink-0 border border-negro select-none">
                {idx + 1}
              </span>
              <span className="text-sm text-gray-700 font-medium leading-tight pt-0.5">{elm}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="flex flex-col gap-2.5 list-none m-0 p-0">
          {elementos.map((elm, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="bg-celeste text-negro font-mono font-bold text-[10px] w-5 h-5 flex items-center justify-center shrink-0 border border-negro select-none">
                ★
              </span>
              <span className="text-sm text-gray-700 font-medium leading-tight pt-0.5">{elm}</span>
            </li>
          ))}
        </ul>
      )}

      {elementos.length === 0 && (
        <div className="text-center text-gray-400 font-mono text-xs select-none py-2">
          Sin elementos en esta lista.
        </div>
      )}
    </div>
  );
}
