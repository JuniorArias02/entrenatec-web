import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * Renderizador para bloques de tipo LINK (Enlace).
 */
export default function EnlaceRenderizador({ bloque }) {
  const url = bloque.propiedades?.url || '#';
  const texto = bloque.propiedades?.texto || bloque.contenido || 'Visitar enlace externo';

  return (
    <div className="mb-4 inline-block select-none">
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white text-azul-secundario border-2 border-negro px-4 py-2 font-bold text-sm shadow-retro hover:bg-celeste hover:text-negro active:translate-y-0.5 active:shadow-retro-sm transition-all"
      >
        <ExternalLink className="w-4 h-4 shrink-0" />
        <span>{texto}</span>
      </a>
    </div>
  );
}
