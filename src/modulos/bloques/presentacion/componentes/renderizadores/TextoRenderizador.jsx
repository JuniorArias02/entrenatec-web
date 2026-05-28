import React from 'react';

/**
 * Renderizador para bloques de tipo TEXTO.
 */
export default function TextoRenderizador({ bloque }) {
  return (
    <p className="text-base text-gray-700 leading-relaxed font-medium mb-4 text-justify">
      {bloque.contenido}
    </p>
  );
}
