import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';
import {
  Monitor,
  Terminal,
  Layers,
  Cpu,
  HelpCircle,
  Play,
  FolderOpen,
  CheckSquare,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { VERSION_SISTEMA } from '@/compartido/constantes/version';

export default function LandingPagina() {
  const { abrirLogin } = useOutletContext();
  const navigate = useNavigate();
  const { estaAutenticado } = usarAutenticacion();

  return (
    <div className="flex flex-col gap-8 py-4 animate-fade-in">
      {/* 1. HERO BANNER: Presentación del EntrenaTec OS */}
      <div className="w-full bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-celeste" />
            <span className="font-mono text-xs uppercase font-bold tracking-wider">
              SISTEMA_OPERATIVO_EDUCATIVO.EXE
            </span>
          </div>
          <div className="bg-celeste text-negro text-[10px] font-bold px-1.5 border border-negro uppercase">
            v{VERSION_SISTEMA}
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="inline-block self-start bg-yellow-100 text-yellow-800 border-2 border-yellow-400 text-xs font-bold px-3 py-1 uppercase font-mono">
              ★ Media Técnica Escolar
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-azul-oscuro m-0 leading-none">
              ENTRENA TEC            </h1>
            <p className="text-lg md:text-xl font-medium text-gray-700 max-w-2xl leading-relaxed">
              Una plataforma web innovadora y de estética retro diseñada especialmente para el aprendizaje técnico en desarrollo de software, algoritmos y bases de datos.
              Orientada al fortalecimiento curricular en la educación secundaria.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              {estaAutenticado ? (
                <button
                  onClick={() => navigate('/inicio')}
                  className="bg-celeste text-negro border-2 border-negro px-6 py-3 font-bold text-sm tracking-wide shadow-retro hover:bg-azul-secundario hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-retro-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  INGRESAR AL SISTEMA
                </button>
              ) : (
                <button
                  onClick={abrirLogin}
                  className="bg-celeste text-negro border-2 border-negro px-6 py-3 font-bold text-sm tracking-wide shadow-retro hover:bg-azul-secundario hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-retro-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  INGRESAR AL SISTEMA (INICIAR SESIÓN)
                </button>
              )}
              <a
                href="#grados"
                className="bg-white text-negro border-2 border-negro px-6 py-3 font-bold text-sm tracking-wide shadow-retro hover:bg-gris-claro active:translate-x-0.5 active:translate-y-0.5 active:shadow-retro-sm transition-all flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('grados')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <HelpCircle className="w-4 h-4" />
                CONOCER EL PLAN DE ESTUDIOS
              </a>
            </div>
          </div>

          {/* Gráfico Retro animado */}
          <div className="lg:col-span-4 flex justify-center items-center">
            <div className="w-64 h-64 bg-gris-claro border-2 border-negro relative flex flex-col justify-center items-center shadow-retro p-4 bg-checkerboard">
              <div className="bg-white border-2 border-black p-4 text-center shadow-retro-sm flex flex-col items-center gap-3">
                <Monitor className="w-16 h-16 text-azul-secundario animate-bounce" />
                <span className="font-mono text-xs font-bold text-azul-oscuro uppercase">ENTRENA_OS v1.0</span>
                <div className="font-mono text-[10px] text-green-600 bg-black px-3 py-1 rounded-sm select-none border border-gray-800">
                  ONLINE // GRADOS: 9_10_11
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. VENTANA DETALLES: ¿Qué es EntrenaTec? */}
      <div className="w-full bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-secundario text-white px-3 py-1 flex items-center justify-between font-bold text-xs uppercase">
          <span>PROYECTO_ENTRENATEC.TXT</span>
          <span>[ ] X</span>
        </div>
        <div className="p-6 bg-white border border-t-0 border-gray-300">
          <h2 className="text-2xl font-extrabold uppercase text-azul-oscuro mb-3">
            ¿Por qué nace EntrenaTec?
          </h2>
          <p className="text-gray-700 leading-relaxed font-medium">
            EntrenaTec es un CMS de aprendizaje dinámico orientado a facilitar la asimilación de conceptos informáticos clave.
            Queremos que la teoría no sea aburrida. Mediante un sistema de bloques estructurados, el estudiante puede visualizar conceptos teóricos,
            ver códigos ejemplo, resolver problemas prácticos en una consola interactiva, y ganar experiencia para avanzar a través del plan de formación técnica.
          </p>
        </div>
      </div>

      {/* 3. PLAN DE ESTUDIOS POR GRADOS: 9º, 10º y 11º */}
      <div id="grados" className="w-full bg-white border-2 border-negro shadow-retro p-1 scroll-mt-6">
        <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-celeste" />
            <span className="font-bold font-mono text-xs uppercase">PLAN_CURRICULAR_POR_GRADOS.DAT</span>
          </div>
        </div>

        <div className="p-6 bg-white border border-t-0 border-gray-300">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold uppercase text-azul-oscuro">
              Orientación de Competencias por Grados
            </h2>
            <p className="text-sm text-gray-500 font-mono mt-1">
              Desarrollo progresivo de habilidades técnicas en la Media Académica (9°, 10° y 11° grado).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Grado 9 */}
            <div className="border-2 border-negro p-4 shadow-retro-sm bg-blue-50 flex flex-col gap-3">
              <div className="bg-azul-oscuro text-white px-2 py-1 text-center font-bold text-sm uppercase border border-negro">
                Grado 9°: Algoritmia
              </div>
              <h4 className="font-bold text-azul-oscuro text-md text-center">Introducción y Lógica</h4>
              <p className="text-xs text-gray-600 leading-relaxed flex-1">
                Enfoque en estructurar el pensamiento lógico y la resolución de problemas básicos. Introducción a pseudocódigo, variables y diagramación lógica interactiva.
              </p>
              <ul className="text-xs font-mono text-gray-700 flex flex-col gap-1 border-t border-gray-300 pt-2 bg-white/50 p-2">
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  Estructuras de Control
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  Operadores Lógicos
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  Lógica Secuencial
                </li>
              </ul>
            </div>

            {/* Grado 10 */}
            <div className="border-2 border-negro p-4 shadow-retro-sm bg-emerald-50 flex flex-col gap-3">
              <div className="bg-azul-secundario text-white px-2 py-1 text-center font-bold text-sm uppercase border border-negro">
                Grado 10°: Desarrollo Web
              </div>
              <h4 className="font-bold text-azul-oscuro text-md text-center">Estructuras y Estilos</h4>
              <p className="text-xs text-gray-600 leading-relaxed flex-1">
                Fundamentos del diseño de software en la web. Aprendizaje práctico de HTML para estructurar, CSS para maquetar, y conceptos iniciales de Javascript estructurado.
              </p>
              <ul className="text-xs font-mono text-gray-700 flex flex-col gap-1 border-t border-gray-300 pt-2 bg-white/50 p-2">
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  Maquetación Semántica
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  Diseño Responsivo (CSS)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  Interactividad básica
                </li>
              </ul>
            </div>

            {/* Grado 11 */}
            <div className="border-2 border-negro p-4 shadow-retro-sm bg-purple-50 flex flex-col gap-3">
              <div className="bg-celeste text-negro px-2 py-1 text-center font-bold text-sm uppercase border border-negro">
                Grado 11°: Backend & APIs
              </div>
              <h4 className="font-bold text-azul-oscuro text-md text-center">Datos y Servicios</h4>
              <p className="text-xs text-gray-600 leading-relaxed flex-1">
                Construcción de aplicaciones robustas. Modelado y conexión con bases de datos relacionales, consumo y creación de APIs tipo REST, y proyectos grupales aplicados.
              </p>
              <ul className="text-xs font-mono text-gray-700 flex flex-col gap-1 border-t border-gray-300 pt-2 bg-white/50 p-2">
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  Modelado Entidad-Relación
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  Integración de APIs JSON
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  Arquitectura Cliente/Servidor
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CARACTERÍSTICAS TÉCNICAS */}
      <div id="caracteristicas" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ventana de Características */}
        <div className="bg-white border-2 border-negro shadow-retro p-1 flex flex-col">
          <div className="bg-azul-secundario text-white px-3 py-1 flex items-center justify-between font-bold text-xs uppercase">
            <span>CARACTERISTICAS_SISTEMA.COM</span>
            <div className="w-3 h-3 bg-red-500 border border-black"></div>
          </div>
          <div className="p-6 bg-white border border-t-0 border-gray-300 flex-1 flex flex-col gap-4">
            <h3 className="text-xl font-bold uppercase text-azul-oscuro border-b border-gray-300 pb-2">
              Características del CMS
            </h3>

            <div className="flex items-start gap-3">
              <div className="bg-celeste border border-black p-1.5 shrink-0 mt-1">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-azul-oscuro">Renderizador de Bloques</h4>
                <p className="text-xs text-gray-600 mt-0.5">Nuestra infraestructura divide los temas en bloques (Texto, Imagen, Código, etc.) para una lectura fluida.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-emerald-100 border border-black p-1.5 shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-emerald-800" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-azul-oscuro">Control de Progreso</h4>
                <p className="text-xs text-gray-600 mt-0.5">Calcula automáticamente el avance del estudiante, nivel de experiencia y temas completados.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-100 border border-black p-1.5 shrink-0 mt-1">
                <Layers className="w-4 h-4 text-purple-800" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-azul-oscuro">Desarrollado Bajo DDD</h4>
                <p className="text-xs text-gray-600 mt-0.5">Siguiendo arquitectura de capas (Dominio, Aplicación, Infraestructura, Presentación) para alta escalabilidad.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consola Terminal Simulada */}
        <div className="bg-white border-2 border-negro shadow-retro p-1 flex flex-col">
          <div className="bg-azul-oscuro text-white px-3 py-1 flex items-center justify-between font-bold text-xs uppercase border-b-2 border-negro">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-celeste" />
              <span>terminal_publica.bat</span>
            </div>
            <div className="w-3 h-3 bg-red-500 border border-black"></div>
          </div>
          <div className="flex-1 bg-azul-oscuro text-celeste p-5 font-mono text-xs flex flex-col gap-2 min-h-[220px]">
            <div>EntrenaTec OS MS-DOS [Versión 1.0.0]</div>
            <div>(C) Copyright EntrenaTec Corp 2026.</div>
            <div className="text-gray-400 mt-2">// INICIO DE TERMINAL EN MODO DEMO</div>
            <div className="text-white mt-1">C:\&gt; entrenatec.exe --grados</div>
            <div className="text-yellow-300">
              [+] Cargando mallas curriculares de 9º, 10º y 11º...
              <br />
              [+] Estado: Listo para inicio de entrenamiento técnico.
            </div>
            {estaAutenticado ? (
              <>
                <div className="text-white mt-2">C:\&gt; sistema --inicio</div>
                <div className="text-yellow-300">
                  [+] Sesión activa detectada. Cargando panel del estudiante...
                </div>
                <div className="mt-auto pt-4 flex justify-center">
                  <button
                    onClick={() => navigate('/inicio')}
                    className="bg-celeste text-negro border-2 border-negro px-4 py-1.5 font-bold font-mono text-xs uppercase shadow-retro hover:bg-white active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    ingresar_sistema.bat
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-white mt-2">C:\&gt; login --iniciar</div>
                <div className="text-white animate-pulse">
                  [+] Abre el panel de login superior o da clic a ingresar.
                </div>
                <div className="mt-auto pt-4 flex justify-center">
                  <button
                    onClick={abrirLogin}
                    className="bg-celeste text-negro border-2 border-negro px-4 py-1.5 font-bold font-mono text-xs uppercase shadow-retro hover:bg-white active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    iniciar_sesion.bat
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
