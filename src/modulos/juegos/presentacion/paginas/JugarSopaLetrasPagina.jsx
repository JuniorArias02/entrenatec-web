import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gamepad2, ArrowLeft, Clock, Award, CheckCircle2 } from 'lucide-react';
import usarSopaLetras from '../hooks/usarSopaLetras';
import { Alerta } from '@/compartido/utilidades/Alerta';

// Función para generar cuadrícula
const generarCuadricula = (palabras, tamaño = 12) => {
  const grid = Array(tamaño).fill(null).map(() => Array(tamaño).fill(''));
  const maxIntentos = 100;
  const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  const dirs = [
    [0, 1], [1, 0], [1, 1], [-1, 1], // derecha, abajo, diag-abajo-der, diag-arriba-der
    [0, -1], [-1, 0], [-1, -1], [1, -1] // izquierda, arriba, diag-arriba-izq, diag-abajo-izq
  ];

  const colocadas = [];

  palabras.forEach(palabra => {
    let colocada = false;
    let intentos = 0;
    while (!colocada && intentos < maxIntentos) {
      const d = dirs[Math.floor(Math.random() * dirs.length)];
      const f = Math.floor(Math.random() * tamaño);
      const c = Math.floor(Math.random() * tamaño);

      let cabe = true;
      for (let i = 0; i < palabra.length; i++) {
        const nf = f + i * d[0];
        const nc = c + i * d[1];
        if (nf < 0 || nf >= tamaño || nc < 0 || nc >= tamaño || (grid[nf][nc] !== '' && grid[nf][nc] !== palabra[i])) {
          cabe = false;
          break;
        }
      }

      if (cabe) {
        const celdas = [];
        for (let i = 0; i < palabra.length; i++) {
          const nf = f + i * d[0];
          const nc = c + i * d[1];
          grid[nf][nc] = palabra[i];
          celdas.push(`${nf},${nc}`);
        }
        colocadas.push({ palabra, celdas });
        colocada = true;
      }
      intentos++;
    }
  });

  // Rellenar vacíos
  for (let i = 0; i < tamaño; i++) {
    for (let j = 0; j < tamaño; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = letras[Math.floor(Math.random() * letras.length)];
      }
    }
  }

  return { grid, colocadas };
};

export default function JugarSopaLetrasPagina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerSopaLetras, evaluarSopaLetras, cargando } = usarSopaLetras();
  
  const [juego, setJuego] = useState(null);
  const [gridData, setGridData] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [jugando, setJugando] = useState(false);
  const [resultado, setResultado] = useState(null);

  // Estado del juego
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [palabrasEncontradas, setPalabrasEncontradas] = useState([]);
  const [celdasResueltas, setCeldasResueltas] = useState(new Set());
  
  const temporizador = useRef(null);

  useEffect(() => {
    obtenerSopaLetras(id).then(data => {
      setJuego(data);
    }).catch(e => {
      Alerta.error('Error', 'No se pudo cargar el juego.');
    });
  }, [id, obtenerSopaLetras]);

  const iniciarJuego = () => {
    if (!juego) return;
    
    // Normalizar el array de palabras en caso de que vengan como objetos desde la base de datos
    const palabrasArray = Array.isArray(juego.palabras) ? juego.palabras : [];
    const palabrasLimpio = palabrasArray
      .map(p => (typeof p === 'string' ? p : (p.palabra || p.texto || '')))
      .filter(p => p && p.length > 0);

    // Si no hay palabras limpias válidas, no podemos jugar
    if (palabrasLimpio.length === 0) {
      Alerta.error('Error', 'El juego no tiene palabras válidas configuradas.');
      return;
    }

    // Calcular tamaño seguro
    const maxLen = Math.max(...palabrasLimpio.map(p => p.length));
    const tamañoCalculado = Math.max(12, maxLen + 2);
    const tamañoSeguro = isNaN(tamañoCalculado) ? 12 : tamañoCalculado;

    setGridData(generarCuadricula(palabrasLimpio, tamañoSeguro));
    setTiempoRestante(juego.tiempo_limite || 120);
    setJugando(true);
    setPalabrasEncontradas([]);
    setCeldasResueltas(new Set());
    setResultado(null);
  };

  useEffect(() => {
    if (jugando && tiempoRestante > 0) {
      temporizador.current = setTimeout(() => setTiempoRestante(prev => prev - 1), 1000);
    } else if (jugando && tiempoRestante <= 0) {
      finalizarJuego();
    }
    return () => clearTimeout(temporizador.current);
  }, [jugando, tiempoRestante]);

  useEffect(() => {
    if (jugando && juego && palabrasEncontradas.length === juego.palabras.length) {
      finalizarJuego();
    }
  }, [palabrasEncontradas, jugando, juego]);

  const finalizarJuego = async () => {
    setJugando(false);
    clearTimeout(temporizador.current);
    const tiempoUtilizado = (juego.tiempo_limite || 120) - tiempoRestante;

    try {
      const resp = await evaluarSopaLetras(id, {
        palabras_encontradas: palabrasEncontradas.length,
        tiempo_utilizado: tiempoUtilizado
      });
      setResultado(resp);
      Alerta.exito('Juego Terminado', 'Resultados guardados exitosamente.');
    } catch (e) {
      Alerta.error('Error al evaluar', e.message);
    }
  };

  const handleMouseDown = (f, c) => {
    if (!jugando) return;
    setIsDragging(true);
    setDragStart({ f, c });
    setDragCurrent({ f, c });
  };

  const handleMouseEnter = (f, c) => {
    if (!jugando || !isDragging) return;
    setDragCurrent({ f, c });
  };

  const handleMouseUp = () => {
    if (!jugando || !isDragging || !dragStart || !dragCurrent) {
      setIsDragging(false);
      setDragStart(null);
      setDragCurrent(null);
      return;
    }

    const f1 = dragStart.f;
    const c1 = dragStart.c;
    const f2 = dragCurrent.f;
    const c2 = dragCurrent.c;

    // Solo validamos si trazó una línea
    if (f1 !== f2 || c1 !== c2) {
      const df = f2 - f1;
      const dc = c2 - c1;
      const distF = Math.abs(df);
      const distC = Math.abs(dc);

      if (distF === 0 || distC === 0 || distF === distC) {
        const pasos = Math.max(distF, distC);
        const dirF = df === 0 ? 0 : df / distF;
        const dirC = dc === 0 ? 0 : dc / distC;

        const celdasTrazadas = [];
        let palabraFormada = '';
        for (let i = 0; i <= pasos; i++) {
          const nf = f1 + i * dirF;
          const nc = c1 + i * dirC;
          celdasTrazadas.push(`${nf},${nc}`);
          palabraFormada += gridData.grid[nf][nc];
        }

        const palabraFormadaInversa = palabraFormada.split('').reverse().join('');

        const match = gridData.colocadas.find(p => 
          !palabrasEncontradas.includes(p.palabra) && 
          (p.palabra === palabraFormada || p.palabra === palabraFormadaInversa)
        );

        if (match) {
          setPalabrasEncontradas([...palabrasEncontradas, match.palabra]);
          setCeldasResueltas(prev => new Set([...prev, ...match.celdas]));
        }
      }
    }

    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  };

  const getCeldasEnArrastre = () => {
    if (!isDragging || !dragStart || !dragCurrent) return new Set();
    const f1 = dragStart.f, c1 = dragStart.c;
    const f2 = dragCurrent.f, c2 = dragCurrent.c;
    
    const df = f2 - f1;
    const dc = c2 - c1;
    const distF = Math.abs(df);
    const distC = Math.abs(dc);

    // Solo trazamos si es horizontal, vertical o diagonal perfecta
    if (distF === 0 || distC === 0 || distF === distC) {
      const pasos = Math.max(distF, distC);
      const dirF = df === 0 ? 0 : df / distF;
      const dirC = dc === 0 ? 0 : dc / distC;
      
      const celdas = new Set();
      for (let i = 0; i <= pasos; i++) {
        celdas.add(`${f1 + i * dirF},${c1 + i * dirC}`);
      }
      return celdas;
    }
    return new Set([`${f1},${c1}`]);
  };

  const celdasArrastre = getCeldasEnArrastre();

  if (!juego) return <div className="text-center p-12 animate-pulse font-mono uppercase text-gray-500">Cargando Motor de Juegos...</div>;

  if (resultado) {
    return (
      <div className="flex flex-col gap-6 py-2 animate-fade-in max-w-2xl mx-auto w-full">
        <div className="bg-white border-2 border-negro shadow-retro p-1 text-center">
          <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center justify-center gap-2 font-mono text-xs uppercase">
            <Award className="w-4 h-4 text-celeste" />
            <span>Resultado_Partida.exe</span>
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro mb-6">Resultados del Juego</h1>
            <div className={`border-4 p-6 mx-auto bg-gray-50 border-negro shadow-[4px_4px_0px_rgba(0,0,0,1)]`}>
              <div className="font-mono text-xs font-bold text-gray-600 mb-2 uppercase">Puntaje Final</div>
              <div className="text-6xl font-extrabold text-azul-secundario">{resultado.puntaje_obtenido}</div>
              <div className="mt-4 font-mono font-bold text-sm text-gray-800 border-t-2 border-dashed border-gray-400 pt-4 flex flex-col gap-2">
                <div>Palabras: {resultado.palabras_encontradas} / {juego.palabras?.length}</div>
                <div>Estado: {resultado.completado ? 'NIVEL COMPLETADO' : 'TIEMPO AGOTADO'}</div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/inicio')}
              className="mt-8 bg-celeste text-negro border-2 border-negro px-6 py-3 font-bold font-mono text-sm uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-azul-secundario hover:text-white transition-all"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in max-w-5xl mx-auto w-full select-none">
      <div className="flex justify-between items-center bg-white border-2 border-negro p-3 shadow-retro-sm">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-6 h-6 text-azul-secundario" />
          <h1 className="font-bold font-mono uppercase text-lg">{juego.titulo}</h1>
        </div>
        <button onClick={() => navigate(-1)} className="bg-gray-200 border-2 border-negro px-3 py-1 font-mono text-xs font-bold uppercase hover:bg-gray-300">
          Abandonar
        </button>
      </div>

      {!jugando ? (
        <div className="bg-white border-2 border-negro p-8 text-center shadow-retro">
          <h2 className="text-2xl font-extrabold text-azul-oscuro uppercase mb-4">Reglas del Juego</h2>
          <p className="text-gray-700 font-medium mb-6 max-w-lg mx-auto">{juego.descripcion}</p>
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <span className="font-mono text-3xl font-bold text-negro">{juego.tiempo_limite}s</span>
              <span className="text-xs uppercase font-bold text-gray-500">Tiempo Límite</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-mono text-3xl font-bold text-negro">{juego.palabras?.length}</span>
              <span className="text-xs uppercase font-bold text-gray-500">Palabras</span>
            </div>
          </div>
          <button 
            onClick={iniciarJuego}
            className="bg-celeste text-negro border-2 border-negro px-8 py-4 font-extrabold font-mono text-lg uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-azul-secundario hover:text-white active:translate-y-1 active:shadow-none transition-all"
          >
            ▶ INICIAR PARTIDA
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Panel Izquierdo: Lista y Tiempo */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white border-2 border-negro shadow-retro-sm p-4 text-center flex flex-col items-center">
              <Clock className={`w-8 h-8 mb-2 ${tiempoRestante <= 15 ? 'text-red-500 animate-pulse' : 'text-negro'}`} />
              <span className={`font-mono text-4xl font-extrabold ${tiempoRestante <= 15 ? 'text-red-600' : 'text-negro'}`}>
                {tiempoRestante}s
              </span>
              <button onClick={finalizarJuego} className="mt-4 w-full bg-red-100 text-red-800 border-2 border-red-800 font-bold font-mono text-xs uppercase py-1 hover:bg-red-600 hover:text-white">
                Terminar Ahora
              </button>
            </div>

            <div className="bg-white border-2 border-negro shadow-retro-sm">
              <div className="bg-azul-oscuro text-white px-3 py-2 font-mono text-xs font-bold uppercase text-center border-b-2 border-negro">
                Palabras ({palabrasEncontradas.length}/{gridData?.colocadas?.length || 0})
              </div>
              <div className="p-3 flex flex-col gap-2 max-h-64 overflow-y-auto">
                {gridData?.colocadas?.map(c => {
                  const p = c.palabra;
                  const encontrada = palabrasEncontradas.includes(p);
                  return (
                    <div key={p} className={`font-mono text-sm font-bold uppercase flex items-center justify-between p-1.5 border-b border-gray-200 ${encontrada ? 'text-gray-400 line-through' : 'text-azul-secundario'}`}>
                      {p}
                      {encontrada && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white border-2 border-negro shadow-retro p-4 overflow-x-auto flex justify-center touch-none">
            {gridData && (
              <div 
                className="grid gap-1 bg-gray-200 border-4 border-negro p-2 select-none" 
                style={{ gridTemplateColumns: `repeat(${gridData.grid[0].length}, minmax(0, 1fr))` }}
                onMouseLeave={handleMouseUp}
                onTouchEnd={handleMouseUp}
              >
                {gridData.grid.map((fila, f) => 
                  fila.map((letra, c) => {
                    const idCelda = `${f},${c}`;
                    const resuelta = celdasResueltas.has(idCelda);
                    const arrastrando = celdasArrastre.has(idCelda);
                    
                    return (
                      <div 
                        key={idCelda}
                        onMouseDown={() => handleMouseDown(f, c)}
                        onMouseEnter={() => handleMouseEnter(f, c)}
                        onMouseUp={handleMouseUp}
                        onTouchStart={(e) => {
                          e.preventDefault(); // previene scroll al jugar en movil
                          handleMouseDown(f, c);
                        }}
                        onTouchMove={(e) => {
                          e.preventDefault();
                          const touch = e.touches[0];
                          const element = document.elementFromPoint(touch.clientX, touch.clientY);
                          if (element) {
                            const match = element.getAttribute('data-coord');
                            if (match) {
                              const [tf, tc] = match.split(',').map(Number);
                              handleMouseEnter(tf, tc);
                            }
                          }
                        }}
                        data-coord={idCelda}
                        className={`
                          w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-extrabold font-mono text-lg sm:text-xl cursor-crosshair border border-gray-300 transition-colors
                          ${resuelta ? 'bg-green-300 text-green-900 border-green-600' : ''}
                          ${arrastrando && !resuelta ? 'bg-yellow-400 text-yellow-900 border-yellow-600 shadow-[inset_0_0_0_2px_black]' : ''}
                          ${!resuelta && !arrastrando ? 'bg-white hover:bg-celeste text-negro' : ''}
                        `}
                      >
                        {letra}
                      </div>
                    );
                  })
                )}
              </div>
            )}
            <div className="mt-4 text-center font-mono text-[10px] text-gray-500 max-w-xs mx-auto lg:hidden">
              Arrastra el dedo desde la primera hasta la última letra de la palabra.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
