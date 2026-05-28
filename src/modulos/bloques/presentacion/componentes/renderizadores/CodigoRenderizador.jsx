import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

/**
 * Renderizador para bloques de tipo CODIGO.
 */
export default function CodigoRenderizador({ bloque }) {
  const [copiado, setCopiado] = useState(false);
  const lenguaje = bloque.contenido || 'javascript';
  const codigo = bloque.propiedades?.codigo || '';

  const copiarAlPortapapeles = () => {
    navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const lineas = codigo.split('\n');

  return (
    <div className="w-full bg-azul-oscuro border-2 border-negro shadow-retro mb-6 max-w-3xl overflow-hidden">
      {/* Cabecera de Consola */}
      <div className="bg-white border-b-2 border-negro px-3 py-1.5 flex items-center justify-between text-xs font-mono font-bold select-none text-negro">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-azul-secundario" />
          <span className="uppercase text-[11px] tracking-wider">{lenguaje}_source.txt</span>
        </div>
        <button 
          onClick={copiarAlPortapapeles}
          className="bg-celeste text-negro border-2 border-negro px-2.5 py-1 text-[10px] uppercase font-bold flex items-center gap-1 active:translate-y-0.5 shadow-[1px_1px_0px_0px_#000000] cursor-pointer"
        >
          {copiado ? (
            <>
              <Check className="w-3 h-3 text-green-700" /> COPIADO
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> COPIAR
            </>
          )}
        </button>
      </div>

      {/* Editor / Consola */}
      <div className="p-4 overflow-x-auto flex font-mono text-xs leading-relaxed text-celeste bg-[#0f172a]">
        {/* Números de Línea */}
        <div className="pr-4 border-r border-gray-700 text-gray-500 text-right select-none min-w-[2.5rem]">
          {lineas.map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>

        {/* Bloque de Código */}
        <pre className="pl-4 m-0 text-white font-mono flex-1 whitespace-pre">
          <code>{codigo}</code>
        </pre>
      </div>
    </div>
  );
}
