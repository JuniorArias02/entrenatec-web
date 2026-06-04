import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import usarInicio from '../hooks/usarInicio';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';
import {
  Monitor,
  Terminal as TerminalIcon,
  Folder,
  Cpu,
  Settings,
  Play,
  Info,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Trophy,
  BookOpen,
  Layers,
  Users,
  Edit3
} from 'lucide-react';
import { VERSION_SISTEMA, VERSION_MSDOS, NOMBRE_SISTEMA } from '@/compartido/constantes/version';
import logomejorado from '@/assets/logomejorado.png';
import AutorizacionRol from '@/compartido/componentes/AutorizacionRol';
import { Alerta } from '@/compartido/utilidades/Alerta';

export default function InicioPagina() {
  const { estadisticas, estadisticasAdmin, cargando, error } = usarInicio();
  const { sesion } = usarAutenticacion();
  const rol = sesion?.rol || 'ESTUDIANTE'; // Por defecto lo tratamos como estudiante visualmente si falla
  
  const [comandoEntrada, setComandoEntrada] = useState('');
  const [logsConsola, setLogsConsola] = useState([
    `${NOMBRE_SISTEMA} MS-DOS [Versión ${VERSION_MSDOS}]`,
    '(C) Copyright EntrenaTec Corp 2026.',
    '',
    'C:\\> entrenatec.exe --iniciar',
    '[+] Cargando base de datos del sistema...',
    '[+] Inicializando interfaz de aprendizaje...',
    '[+] Conexión establecida con el núcleo.',
    'Escribe "ayuda" para ver comandos disponibles.',
    ''
  ]);

  // Manejo de comandos interactivos de la terminal retro
  const manejarEnvioComando = (e) => {
    e.preventDefault();
    if (!comandoEntrada.trim()) return;

    const comando = comandoEntrada.toLowerCase().trim();
    let nuevasLineas = [`C:\\> ${comandoEntrada}`];

    switch (comando) {
      case 'ayuda':
        nuevasLineas.push(
          'Comandos disponibles:',
          '  ayuda     - Muestra este menú de ayuda.',
          '  limpiar   - Limpia la pantalla de la terminal.',
          '  secreto   - Revela un código secreto retro.',
          '  sistema   - Muestra información del sistema operativo.',
          '  hack      - Ejecuta una animación de hack de mentira.'
        );
        break;
      case 'limpiar':
        setLogsConsola([]);
        setComandoEntrada('');
        return;
      case 'secreto':
        nuevasLineas.push(
          '   _  _  _  _  _  _  _  _   ',
          '  / \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\  ',
          ' ( Y | 2 | K | _ | R | U | L | E ) ',
          '  \\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/  ',
          '  ¡Felicidades! Has encontrado el huevo de pascua Y2K.'
        );
        break;
      case 'sistema':
        nuevasLineas.push(
          `${NOMBRE_SISTEMA} v${VERSION_SISTEMA}`,
          'Host: Navegador Web Estándar',
          'Kernel: React 19.2 + Tailwind 4.3',
          'Resolución: Retro Grids Activo',
          'Estado de Ánimo: ¡Excelente!'
        );
        break;
      case 'hack':
        nuevasLineas.push(
          '...ACCEDIENDO AL SINFÍN DE DATOS...',
          '10101001010010101110101010101111010',
          '[ALERTA] Nivel de tecnología detectado: EXTREMO.',
          '[OK] Has hackeado el sistema para aprender más rápido.'
        );
        break;
      default:
        nuevasLineas.push(`Comando no reconocido: "${comando}". Escribe "ayuda" para ver las opciones.`);
    }

    setLogsConsola((prev) => [...prev, ...nuevasLineas, '']);
    setComandoEntrada('');
  };

  // Pantalla de carga retro estilo Windows
  if (cargando) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-96 bg-gris-claro border-2 border-negro shadow-retro p-1">
          {/* Barra de Título */}
          <div className="bg-azul-secundario text-white px-3 py-1 font-bold text-xs uppercase flex items-center justify-between">
            <span>Cargando Sistema...</span>
            <span className="animate-pulse">_</span>
          </div>
          {/* Contenido de Carga */}
          <div className="p-6 flex flex-col items-center gap-4 bg-white border border-t-0 border-gray-300">
            <Monitor className="w-12 h-12 text-azul-secundario animate-bounce" />
            <div className="text-center font-bold text-sm tracking-wide">
              ENTRENATEC.EXE
            </div>
            <div className="text-xs text-gray-500 font-mono">
              Cargando módulos y variables de entorno...
            </div>

            {/* Barra de progreso retro */}
            <div className="w-full bg-gray-200 border border-black h-6 p-0.5 flex gap-0.5 overflow-hidden">
              <div className="bg-azul-secundario w-1/4 h-full animate-[pulse_1.5s_infinite]"></div>
              <div className="bg-azul-secundario w-1/4 h-full animate-[pulse_1.5s_infinite_0.2s]"></div>
              <div className="bg-azul-secundario w-1/4 h-full animate-[pulse_1.5s_infinite_0.4s]"></div>
              <div className="bg-azul-secundario w-1/4 h-full animate-[pulse_1.5s_infinite_0.6s]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-96 bg-red-100 border-2 border-red-600 shadow-retro p-1">
          <div className="bg-red-600 text-white px-3 py-1 font-bold text-xs uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Falla en el Sistema</span>
          </div>
          <div className="p-6 bg-white border border-t-0 border-red-300 flex flex-col gap-4">
            <p className="font-bold text-sm text-red-600 font-mono">
              ERROR: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gris-claro border-2 border-negro px-4 py-2 font-bold text-xs shadow-retro-sm active:translate-y-0.5 active:shadow-none hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Porcentaje recuperado desde el backend
  const avance = estadisticas?.progreso_general || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Sección Superior: Ventana de Bienvenida */}
      <div className="w-full bg-white border-2 border-negro shadow-retro p-1">
        {/* Barra superior de la ventana */}
        <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-celeste" />
            <span className="font-bold font-mono text-xs uppercase tracking-widest">
              BIENVENIDO_A_ENTRENATEC.EXE
            </span>
          </div>
          <div className="bg-celeste text-negro text-[10px] font-bold px-1.5 border border-negro uppercase select-none">
            Activo
          </div>
        </div>

        {/* Contenido Principal de la ventana */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-azul-oscuro m-0">
              ENTRENA TEC            </h1>
            <p className="text-lg font-medium text-gray-700">
              Tu portal interactivo de aprendizaje técnico. Explora módulos educativos, practica en tiempo real y gestiona tus conocimientos en una interfaz retro-tecnológica.
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                to="/grados"
                className="bg-celeste text-negro border-2 border-negro px-4 py-2.5 font-bold text-sm tracking-wide shadow-retro hover:bg-azul-secundario hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-retro-sm transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                COMENZAR ENTRENAMIENTO
              </Link>
              <button
                onClick={() => Alerta.info('Info.exe', '¡EntrenaTec es un CMS de aprendizaje interactivo!')}
                className="bg-white text-negro border-2 border-negro px-4 py-2.5 font-bold text-sm tracking-wide shadow-retro hover:bg-gris-claro active:translate-x-0.5 active:translate-y-0.5 active:shadow-retro-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Info className="w-4 h-4" />
                CONOCER MÁS
              </button>
            </div>
          </div>

          {/* Gráfico Retro / Imagen */}
          <div className="flex justify-center items-center">
            <div className="w-48 h-48 bg-gris-claro border-2 border-negro relative flex flex-col justify-center items-center shadow-retro-sm p-4 bg-checkerboard">
              <img src={logomejorado} alt="Logo EntrenaTec" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* Sección del Dashboard: Tarjetas de estadísticas */}
      {rol === 'ESTUDIANTE' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Nivel de Progreso */}
          <div className="bg-celeste border-2 border-negro shadow-retro-sm p-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute right-2 top-2 opacity-15">
              <Trophy className="w-12 h-12" />
            </div>
            <span className="font-mono text-xs uppercase font-bold text-gray-800">
              Progreso General
            </span>
            <div className="text-3xl font-extrabold font-mono">
              {avance}%
            </div>
            <div className="w-full bg-white border border-black h-3 overflow-hidden mt-1">
              <div className="bg-azul-secundario h-full border-r border-black" style={{ width: `${avance}%` }}></div>
            </div>
          </div>

          {/* Nivel de Usuario */}
          <div className="bg-white border-2 border-negro shadow-retro-sm p-4 flex flex-col gap-1.5 relative">
            <span className="font-mono text-xs uppercase font-bold text-gray-500">
              Nivel del Estudiante
            </span>
            <div className="text-3xl font-extrabold text-azul-secundario">
              NIVEL {estadisticas?.nivel || 1}
            </div>
            <span className="text-xs font-mono text-gray-600">
              Sigue completando temas para subir de nivel
            </span>
          </div>

          {/* Temas completados */}
          <div className="bg-white border-2 border-negro shadow-retro-sm p-4 flex flex-col gap-1.5 relative">
            <span className="font-mono text-xs uppercase font-bold text-gray-500">
              Temas Completados
            </span>
            <div className="text-3xl font-extrabold">
              {estadisticas?.temas_completados || 0} / {estadisticas?.temas_totales || 0}
            </div>
            <span className="text-xs font-mono text-gray-600">
              Temas activos de tu plan de estudios
            </span>
          </div>

          {/* Horas Practicadas */}
          <div className="bg-white border-2 border-negro shadow-retro-sm p-4 flex flex-col gap-1.5 relative">
            <span className="font-mono text-xs uppercase font-bold text-gray-500">
              Tiempo de Práctica
            </span>
            <div className="text-3xl font-extrabold">
              {estadisticas?.horas_estudio || 0} Horas
            </div>
            <span className="text-xs font-mono text-gray-600 font-bold text-green-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              ¡Buen ritmo de estudio!
            </span>
          </div>
        </div>
      ) : (
        /* Dashboard para Profesores/Admin */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-yellow-100 border-2 border-negro shadow-retro-sm p-4 flex flex-col gap-1.5 relative">
            <span className="font-mono text-xs uppercase font-bold text-gray-700">
              Rol Activo
            </span>
            <div className="text-2xl font-extrabold text-azul-oscuro">
              {rol}
            </div>
            <span className="text-xs font-mono text-gray-600">
              Tienes permisos avanzados.
            </span>
          </div>
          
          <div className="bg-white border-2 border-negro shadow-retro-sm p-4 flex flex-col gap-1.5 relative">
            <span className="font-mono text-xs uppercase font-bold text-gray-500">
              Contenido Curricular
            </span>
            <div className="text-2xl font-extrabold text-green-600 flex items-baseline gap-2">
              {estadisticasAdmin?.temas_publicados || 0}
              <span className="text-sm text-gray-500">/ {estadisticasAdmin?.temas_totales || 0}</span>
            </div>
            <span className="text-xs font-mono text-gray-600">
              Temas publicados en total.
            </span>
          </div>
          
          <div className="bg-white border-2 border-negro shadow-retro-sm p-4 flex flex-col gap-1.5 relative">
            <span className="font-mono text-xs uppercase font-bold text-gray-500">
              Estructura
            </span>
            <div className="text-2xl font-extrabold text-azul-secundario">
              {estadisticasAdmin?.grados || 0} Grados
            </div>
            <span className="text-xs font-mono text-gray-600">
              {estadisticasAdmin?.materias || 0} materias registradas.
            </span>
          </div>

          {estadisticasAdmin?.usuarios_totales ? (
            <div className="bg-white border-2 border-negro shadow-retro-sm p-4 flex flex-col gap-1.5 relative">
              <span className="font-mono text-xs uppercase font-bold text-gray-500">
                Usuarios Totales
              </span>
              <div className="text-2xl font-extrabold text-negro flex items-center gap-2">
                <Users className="w-5 h-5 text-azul-secundario" />
                {estadisticasAdmin?.usuarios_totales}
              </div>
              <span className="text-xs font-mono text-gray-600">
                {estadisticasAdmin?.estudiantes} Est. | {estadisticasAdmin?.docentes} Doc.
              </span>
            </div>
          ) : (
            <div className="bg-white border-2 border-negro shadow-retro-sm p-4 flex flex-col gap-1.5 relative">
              <span className="font-mono text-xs uppercase font-bold text-gray-500">
                Planificación
              </span>
              <div className="text-2xl font-extrabold text-azul-secundario">
                {estadisticasAdmin?.cuadros_teoricos || 0} Planes
              </div>
              <span className="text-xs font-mono text-gray-600">
                Cuadros teóricos disponibles.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Grid de Secciones y Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Accesos Directos (8 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white border-2 border-negro p-4 shadow-retro-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold uppercase border-b-2 border-negro pb-2 flex items-center gap-2">
              <Folder className="w-5 h-5 text-azul-secundario" />
              ACCESOS DIRECTOS DEL SISTEMA
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/grados"
                className="group border-2 border-negro p-3 hover:bg-gris-claro transition-all shadow-retro-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-3"
              >
                <div className="bg-celeste border border-black p-2 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6 text-negro" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-azul-oscuro group-hover:underline">
                    EXPLORADOR DE TEMAS
                  </h3>
                  <p className="text-xs text-gray-500">
                    Ver los bloques de conocimiento y lecciones.
                  </p>
                </div>
              </Link>

              <Link
                to="/grados"
                className="group border-2 border-negro p-3 hover:bg-gris-claro transition-all shadow-retro-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-3"
              >
                <div className="bg-white border border-black p-2 group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6 text-azul-secundario" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-azul-oscuro group-hover:underline">
                    MATERIAS Y CURSOS
                  </h3>
                  <p className="text-xs text-gray-500">
                    Organización de planes de estudio y guías.
                  </p>
                </div>
              </Link>

              {/* Mostrar creación de temas solo si tiene permisos avanzados */}
              <AutorizacionRol rolesPermitidos={['ADMIN', 'DOCENTE', 'EDITOR']}>
                <Link
                  to="/temas/crear"
                  className="group border-2 border-negro p-3 hover:bg-gris-claro transition-all shadow-retro-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-3"
                >
                  <div className="bg-yellow-200 border border-black p-2 group-hover:scale-105 transition-transform">
                    <Edit3 className="w-6 h-6 text-yellow-800" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-azul-oscuro group-hover:underline">
                      CREADOR DE TEMAS
                    </h3>
                    <p className="text-xs text-gray-500">
                      Gestiona el contenido (Bloques, Cuadros).
                    </p>
                  </div>
                </Link>
              </AutorizacionRol>

              {/* Mostrar panel de usuarios solo si es ADMIN */}
              <AutorizacionRol rolesPermitidos={['ADMIN']}>
                <Link
                  to="/usuarios"
                  className="group border-2 border-negro p-3 hover:bg-gris-claro transition-all shadow-retro-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-3"
                >
                  <div className="bg-white border border-black p-2 group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6 text-azul-secundario" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-azul-oscuro group-hover:underline">
                      PANEL DE USUARIOS
                    </h3>
                    <p className="text-xs text-gray-500">
                      Configuración de perfiles y roles locales.
                    </p>
                  </div>
                </Link>
              </AutorizacionRol>

              <div
                onClick={() => Alerta.info('Licencia_y_Codigo', 'EntrenaTec es una aplicación educativa de código abierto.')}
                className="group border-2 border-negro p-3 hover:bg-gris-claro transition-all shadow-retro-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-3 cursor-pointer"
              >
                <div className="bg-green-100 border border-black p-2 group-hover:scale-105 transition-transform">
                  <Settings className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-azul-oscuro group-hover:underline">
                    ACERCA DEL SOFTWARE
                  </h3>
                  <p className="text-xs text-gray-500">
                    Información sobre EntrenaTec OS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Terminal Interactiva (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white border-2 border-negro p-1 shadow-retro-sm flex flex-col flex-1 min-h-[300px]">
            {/* Cabecera Terminal */}
            <div className="bg-azul-secundario text-white px-3 py-1 flex items-center justify-between border-b-2 border-negro">
              <div className="flex items-center gap-1.5">
                <TerminalIcon className="w-4 h-4 text-celeste" />
                <span className="font-mono text-xs font-bold uppercase">consola_comandos.com</span>
              </div>
              <div className="w-3 h-3 bg-red-500 border border-black"></div>
            </div>

            {/* Contenido Terminal */}
            <div className="flex-1 bg-azul-oscuro text-celeste p-4 font-mono text-xs flex flex-col gap-1 overflow-y-auto select-text leading-relaxed">
              <div className="flex-1 flex flex-col justify-end">
                {logsConsola.map((linea, index) => (
                  <div key={index} className="min-h-[1rem]">
                    {linea}
                  </div>
                ))}
              </div>

              {/* Formulario de Entrada */}
              <form onSubmit={manejarEnvioComando} className="flex items-center gap-1 mt-1">
                <span>C:\&gt;</span>
                <input
                  type="text"
                  value={comandoEntrada}
                  onChange={(e) => setComandoEntrada(e.target.value)}
                  className="flex-1 bg-transparent text-white focus:outline-hidden font-mono text-xs caret-celeste border-none p-0 m-0"
                  autoComplete="off"
                  spellCheck="false"
                  placeholder='Escribe "ayuda"...'
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
