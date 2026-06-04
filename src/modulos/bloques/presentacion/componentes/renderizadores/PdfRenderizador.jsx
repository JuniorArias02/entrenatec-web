import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Alerta } from '@/compartido/utilidades/Alerta';

/**
 * Renderizador para bloques de tipo PDF.
 */
export default function PdfRenderizador({ bloque }) {
  const archivoNombre = bloque.propiedades?.archivoNombre || 'documento_lectura.pdf';
  const tamano = bloque.propiedades?.tamano || '1.0 MB';
  const url = bloque.contenido || bloque.metadata?.url || bloque.propiedades?.url || '#';
  const descripcion = bloque.contenido || 'Guía teórica de estudio complementario.';

  return (
    <div className="w-full bg-white border-2 border-negro p-1 shadow-retro mb-6 max-w-xl">
      <div className="bg-azul-secundario text-white px-3 py-1 text-xs font-mono font-bold flex items-center justify-between border-b-2 border-negro select-none">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-celeste" />
          <span>VISOR_DOCUMENTOS.EXE</span>
        </div>
        <span>PDF</span>
      </div>

      <div className="p-4 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-200">
        <div className="flex items-start gap-3">
          <div className="bg-red-100 border-2 border-negro p-2 text-red-700 shrink-0 select-none">
            <span className="font-extrabold text-xs font-mono block">PDF</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-azul-oscuro break-all">{archivoNombre}</span>
            <span className="text-[11px] font-mono text-gray-500">{tamano} — {descripcion}</span>
          </div>
        </div>

        <a 
          href={url}
          download={archivoNombre}
          onClick={(e) => {
            if (url === '#') {
              e.preventDefault();
              Alerta.info('Descarga_Virtual', `Simulando descarga de: ${archivoNombre}`);
            }
          }}
          className="bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold font-mono text-xs uppercase shadow-retro hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer select-none"
        >
          <Download className="w-3.5 h-3.5" />
          DESCARGAR
        </a>
      </div>
    </div>
  );
}
