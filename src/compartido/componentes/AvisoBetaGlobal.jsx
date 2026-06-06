import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function AvisoBetaGlobal() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-sm w-full bg-white border-2 border-negro shadow-[6px_6px_0px_rgba(0,0,0,1)] z-50 animate-pulse-slow">
      {/* Barra de título estilo Windows antiguo */}
      <div className="bg-yellow-400 text-negro px-3 py-1.5 flex items-center justify-between font-bold text-xs uppercase border-b-2 border-negro select-none">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span className="tracking-widest">SISTEMA_EN_BETA.EXE</span>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="w-5 h-5 bg-gris-claro text-negro border border-white border-r-gray-500 border-b-gray-500 flex items-center justify-center font-bold font-mono text-[9px] hover:bg-red-500 hover:text-white transition-colors cursor-pointer shadow-retro-sm active:translate-y-px active:shadow-none"
          title="Cerrar aviso"
        >
          X
        </button>
      </div>
      
      {/* Contenido del aviso */}
      <div className="p-5 bg-yellow-50 text-xs font-mono text-gray-800 flex flex-col gap-3">
        <p className="font-extrabold text-sm text-negro border-b border-dashed border-gray-400 pb-2">
          [!] MODO DEMOSTRACIÓN ACTIVADO
        </p>
        <p className="leading-relaxed">
          Este sistema se encuentra operando en una <span className="font-bold bg-yellow-200">versión Beta limitadada</span>. Algunas funcionalidades clave, la persistencia en la nube y el soporte técnico podrían estar temporalmente pausados.
        </p>
        <div className="bg-white border border-negro p-2 mt-1">
          <p className="text-negro font-bold">MOTIVO_SISTEMA:</p>
          <p className="text-gray-600 mt-1">
            Esperando validación de licencia institucional y despliegue a producción final.
          </p>
        </div>
        <p className="mt-1 text-[10px] text-red-600 font-bold uppercase italic text-center">
          * Contacte al equipo desarrollador para la liberación de la versión completa. *
        </p>
      </div>
    </div>
  );
}
