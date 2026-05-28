import React from 'react';

/**
 * Renderizador para bloques de tipo SEPARADOR.
 */
export default function SeparadorRenderizador() {
  return (
    <div className="w-full my-6 select-none" role="separator">
      <div className="border-t-2 border-dashed border-gray-400"></div>
    </div>
  );
}
