import React from 'react';
import { Terminal } from 'lucide-react';

/**
 * Renderizador para bloques de tipo TITULO.
 */
export default function TituloRenderizador({ bloque }) {
  const Tag = bloque.metadata?.nivel || 'h2';

  // Configurar clases base pero permitir override de color
  const colorEstilo = bloque.metadata?.color ? { color: bloque.metadata.color } : {};

  return (
    <div className="flex items-center gap-3 border-b-4 border-negro pb-2 mb-6 mt-4 select-none">
      <div className="bg-celeste border-2 border-negro p-1.5 shadow-retro-sm">
        <Terminal className="w-5 h-5 text-negro" />
      </div>
      <Tag 
        className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-azul-oscuro m-0 leading-none"
        style={colorEstilo}
      >
        {bloque.contenido}
      </Tag>
    </div>
  );
}
