import React from 'react';

/**
 * Renderizador para bloques de tipo TABLA.
 */
export default function TablaRenderizador({ bloque }) {
  const cabeceras = bloque.propiedades?.cabeceras || bloque.metadata?.cabeceras || [];
  const filas = bloque.propiedades?.filas || bloque.metadata?.filas || [];
  const titulo = bloque.contenido;

  return (
    <div className="w-full bg-white border-2 border-negro p-1 shadow-retro mb-6 overflow-hidden">
      {titulo && (
        <div className="bg-azul-oscuro text-white px-3 py-1 text-xs font-mono font-bold select-none border-b-2 border-negro">
          TABLA_DATOS.CSV — {titulo}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="bg-celeste border-b-2 border-negro">
              {cabeceras.map((cab, idx) => (
                <th key={idx} className="p-2.5 border-r border-negro last:border-r-0 font-bold uppercase text-negro select-none">
                  {cab}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, fIdx) => (
              <tr 
                key={fIdx} 
                className={`border-b border-negro last:border-b-0 ${fIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                {fila.map((celda, cIdx) => (
                  <td key={cIdx} className="p-2.5 border-r border-negro last:border-r-0 text-gray-700 font-medium font-sans">
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
            {filas.length === 0 && (
              <tr>
                <td colSpan={cabeceras.length || 1} className="p-4 text-center text-gray-400 font-mono select-none">
                  Sin datos cargados en esta tabla.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
