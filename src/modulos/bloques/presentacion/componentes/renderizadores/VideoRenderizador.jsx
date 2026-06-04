import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, Maximize2 } from 'lucide-react';

/**
 * Renderizador para bloques de tipo VIDEO.
 */
export default function VideoRenderizador({ bloque }) {
  const videoRef = useRef(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const url = bloque.propiedades?.url || bloque.contenido;
  const titulo = bloque.propiedades?.titulo || 'Video de Aprendizaje';
  const esYoutube = bloque.metadata?.plataforma === 'youtube' || (url && url.includes('youtube.com'));
  
  // Convertir URL de YouTube a URL embebida
  let youtubeEmbedUrl = url;
  if (esYoutube && url) {
    const videoIdMatch = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      youtubeEmbedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
  }

  const alternarReproduccion = () => {
    if (videoRef.current) {
      if (reproduciendo) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setReproduciendo(!reproduciendo);
    }
  };

  const alternarPantallaCompleta = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen?.();
    }
  };

  return (
    <div className="w-full bg-white border-2 border-negro p-1 shadow-retro mb-6 max-w-2xl mx-auto">
      <div className="bg-azul-oscuro text-white px-3 py-1.5 text-xs font-mono font-bold flex justify-between items-center border-b-2 border-negro select-none">
        <span className="truncate">MULTIMEDIA_PLAYER.EXE - {titulo}</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-celeste border border-black cursor-pointer"></div>
          <div className="w-3 h-3 bg-red-500 border border-black cursor-pointer"></div>
        </div>
      </div>

      <div className="relative bg-black border-b-2 border-negro overflow-hidden flex items-center justify-center min-h-[180px] max-h-[360px]">
        {url ? (
          esYoutube ? (
            <iframe
              src={youtubeEmbedUrl}
              title={titulo}
              className="w-full h-full max-h-[360px] aspect-video border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video 
              ref={videoRef}
              src={url}
              className="w-full h-full max-h-[360px]"
              onClick={alternarReproduccion}
              onEnded={() => setReproduciendo(false)}
            />
          )
        ) : (
          <div className="text-gray-500 font-mono text-xs">Sin archivo de video disponible</div>
        )}
      </div>

      {/* Controles de Reproductor Retro */}
      <div className="p-3 bg-gris-claro flex items-center justify-between gap-4 font-mono text-xs select-none">
        <div className="flex items-center gap-2">
          <button 
            onClick={alternarReproduccion}
            className="bg-celeste border-2 border-negro px-3 py-1 font-bold shadow-retro-sm active:translate-y-0.5 active:shadow-none hover:bg-azul-secundario hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            {reproduciendo ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> PAUSAR
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> REPRODUCIR
              </>
            )}
          </button>
        </div>

        <div className="flex-1 bg-white border border-negro h-5 relative flex items-center overflow-hidden">
          <div className="bg-celeste/30 h-full w-[45%] border-r border-negro"></div>
          <span className="absolute left-2 text-[10px] font-bold text-azul-oscuro">MODO LECTURA MULTIMEDIA</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 bg-white border border-negro shrink-0">
            <Volume2 className="w-4 h-4 text-azul-secundario" />
          </div>
          <button 
            onClick={alternarPantallaCompleta}
            className="bg-white border-2 border-negro p-1 shadow-retro-sm active:translate-y-0.5 active:shadow-none hover:bg-gray-100 cursor-pointer shrink-0"
            title="Pantalla Completa"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
