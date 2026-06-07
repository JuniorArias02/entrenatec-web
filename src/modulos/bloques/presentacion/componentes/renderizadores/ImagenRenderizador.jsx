import React from 'react';
import { obtenerUrlCompleta } from '@/compartido/utilidades/obtenerUrlCompleta';

/**
 * Renderizador para bloques de tipo IMAGEN.
 */
export default function ImagenRenderizador({ bloque }) {
  const url = bloque.contenido || bloque.metadata?.url || bloque.propiedades?.url;
  const leyenda = bloque.propiedades?.leyenda;

  return (
    <div className="w-full bg-white border-2 border-negro p-1.5 shadow-retro mb-6 max-w-2xl mx-auto">
      <div className="bg-azul-secundario text-white px-2 py-1 text-[10px] font-mono uppercase font-bold flex justify-between border-b border-negro select-none">
        <span>VISOR_IMAGENES.EXE</span>
        <span>100%</span>
      </div>
      <div className="border border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center min-h-[200px]">
        {url ? (
          <img 
            src={obtenerUrlCompleta(url)} 
            alt={leyenda || 'Contenido visual educativo'} 
            className="max-h-[350px] w-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-400 font-mono text-xs select-none">Sin imagen cargada</div>
        )}
      </div>
      {leyenda && (
        <div className="bg-gris-claro border-t border-negro p-2 font-mono text-[11px] text-azul-oscuro text-center select-none font-bold">
          {leyenda}
        </div>
      )}
    </div>
  );
}
