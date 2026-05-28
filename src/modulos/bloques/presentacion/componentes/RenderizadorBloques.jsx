import React from 'react';
import TituloRenderizador from './renderizadores/TituloRenderizador';
import SubtituloRenderizador from './renderizadores/SubtituloRenderizador';
import TextoRenderizador from './renderizadores/TextoRenderizador';
import ImagenRenderizador from './renderizadores/ImagenRenderizador';
import GaleriaRenderizador from './renderizadores/GaleriaRenderizador';
import VideoRenderizador from './renderizadores/VideoRenderizador';
import PdfRenderizador from './renderizadores/PdfRenderizador';
import EnlaceRenderizador from './renderizadores/EnlaceRenderizador';
import TablaRenderizador from './renderizadores/TablaRenderizador';
import ListaRenderizador from './renderizadores/ListaRenderizador';
import CodigoRenderizador from './renderizadores/CodigoRenderizador';
import ActividadRenderizador from './renderizadores/ActividadRenderizador';
import QuizRenderizador from './renderizadores/QuizRenderizador';
import MiniJuegoRenderizador from './renderizadores/MiniJuegoRenderizador';
import SeparadorRenderizador from './renderizadores/SeparadorRenderizador';

// Mapeo asociativo de tipos de bloques a sus respectivos componentes renderizadores
const MAPA_RENDERIZADORES = {
  TITULO: TituloRenderizador,
  SUBTITULO: SubtituloRenderizador,
  TEXTO: TextoRenderizador,
  IMAGEN: ImagenRenderizador,
  GALERIA: GaleriaRenderizador,
  VIDEO: VideoRenderizador,
  PDF: PdfRenderizador,
  LINK: EnlaceRenderizador,
  TABLA: TablaRenderizador,
  LISTA: ListaRenderizador,
  CODIGO: CodigoRenderizador,
  ACTIVIDAD: ActividadRenderizador,
  QUIZ: QuizRenderizador,
  MINIJUEGO: MiniJuegoRenderizador,
  SEPARADOR: SeparadorRenderizador,
};

/**
 * Componente Core: Renderizador de Bloques Dinámicos.
 * Toma un arreglo de bloques y delega el renderizado de cada uno según su tipo.
 */
export default function RenderizadorBloques({ bloques = [] }) {
  if (!Array.isArray(bloques) || bloques.length === 0) {
    return (
      <div className="bg-gris-claro border-2 border-dashed border-negro p-6 text-center select-none font-mono text-xs text-gray-500">
        No hay bloques de contenido cargados para este tema.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {bloques.map((bloque) => {
        const ComponenteRenderizador = MAPA_RENDERIZADORES[bloque.tipo];
        
        if (!ComponenteRenderizador) {
          return (
            <div 
              key={bloque.id || Math.random()} 
              className="bg-yellow-50 border border-yellow-400 p-3 text-xs font-mono text-yellow-800"
            >
              [!] Advertencia: Tipo de bloque desconocido o no soportado: "{bloque.tipo}"
            </div>
          );
        }

        try {
          return (
            <div key={bloque.id || Math.random()} className="w-full">
              <ComponenteRenderizador bloque={bloque} />
            </div>
          );
        } catch (e) {
          console.error(`Error renderizando bloque ID: ${bloque.id}, tipo: ${bloque.tipo}`, e);
          return (
            <div 
              key={bloque.id || Math.random()} 
              className="bg-red-50 border border-red-400 p-3 text-xs font-mono text-red-800"
            >
              [X] Error fatal renderizando bloque de tipo "{bloque.tipo}".
            </div>
          );
        }
      })}
    </div>
  );
}
