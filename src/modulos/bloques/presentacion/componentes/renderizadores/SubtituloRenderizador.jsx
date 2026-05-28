import React from 'react';

/**
 * Renderizador para bloques de tipo SUBTITULO.
 */
export default function SubtituloRenderizador({ bloque }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-6 select-none">
      <div className="w-3 h-3 bg-azul-secundario border border-negro shrink-0"></div>
      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-azul-secundario m-0">
        {bloque.contenido}
      </h2>
    </div>
  );
}
