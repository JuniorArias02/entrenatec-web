import React from 'react';

/**
 * Renderizador para bloques de tipo GALERIA.
 */
export default function GaleriaRenderizador({ bloque }) {
  const imagenes = bloque.propiedades?.imagenes || [];
  const descripcion = bloque.contenido;

  return (
    <div className="w-full bg-white border-2 border-negro p-1 shadow-retro mb-6">
      <div className="bg-azul-oscuro text-white px-3 py-1 text-[11px] font-mono uppercase font-bold flex justify-between select-none">
        <span>EXPLORADOR_GALERIA.DLL</span>
        <span>{imagenes.length} ARCHIVOS</span>
      </div>
      
      <div className="p-4 bg-gray-50 border-t-2 border-negro">
        {descripcion && (
          <p className="text-xs font-mono text-gray-600 mb-3 select-none">
            Directorio: C:\EntrenaTech\Galeria\ &gt; {descripcion}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imagenes.map((img, idx) => (
            <div key={idx} className="bg-white border-2 border-negro shadow-retro-sm p-1 flex flex-col">
              <div className="flex-1 overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center min-h-[140px]">
                <img 
                  src={img.url} 
                  alt={img.leyenda || `Imagen de galería ${idx + 1}`} 
                  className="w-full h-36 object-cover"
                />
              </div>
              {img.leyenda && (
                <div className="p-2 text-[10px] font-mono font-bold text-azul-oscuro border-t border-gray-300 text-center select-none truncate">
                  {img.leyenda}
                </div>
              )}
            </div>
          ))}
          {imagenes.length === 0 && (
            <div className="col-span-full py-8 text-center text-gray-400 font-mono text-xs select-none">
              Sin archivos de imagen en esta galería.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
