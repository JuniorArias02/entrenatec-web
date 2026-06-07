import React from 'react';
import { HelpCircle, Monitor, BookOpen, Edit3, HelpCircle as HelpIcon, Gamepad2, Layers, Users, MousePointer2 } from 'lucide-react';

export default function AyudaPagina() {
  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in max-w-6xl mx-auto w-full">
      {/* Cabecera Principal */}
      <div className="bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1 flex items-center gap-2 font-mono text-xs uppercase">
          <HelpCircle className="w-4 h-4 text-celeste" />
          <span>Manual_De_Usuario.exe</span>
        </div>
        <div className="p-6 bg-white border-b-2 border-negro">
          <h1 className="text-4xl font-extrabold uppercase text-azul-oscuro m-0 font-rajdhani tracking-wider">
            DOCUMENTACIÓN DEL SISTEMA
          </h1>
          <p className="text-base text-gray-700 mt-3 font-medium">
            Bienvenido a la guía interactiva de EntrenaTec OS. Aquí aprenderás cómo funciona cada componente de nuestra plataforma educativa.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12">
        
        {/* Contenido Izquierda (Navegación Principal) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="bg-white border-2 border-negro shadow-retro">
            <div className="bg-azul-secundario text-white px-3 py-2 font-bold font-mono text-sm uppercase flex items-center gap-2 border-b-2 border-negro select-none">
              <Monitor className="w-4 h-4" />
              Barra Lateral (Módulos del Sistema)
            </div>
            <div className="p-6 flex flex-col gap-8">
              
              {/* Opción: Inicio */}
              <div className="flex gap-4">
                <div className="bg-celeste text-negro border-2 border-negro w-12 h-12 flex items-center justify-center shrink-0 shadow-retro-sm">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-azul-oscuro text-lg uppercase tracking-wide font-rajdhani">Inicio</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Es el panel principal (Dashboard). Aquí tendrás una vista general de tu actividad reciente, accesos rápidos y resúmenes de la plataforma para comenzar tu sesión.
                  </p>
                </div>
              </div>

              {/* Opción: Plan Curricular */}
              <div className="flex gap-4">
                <div className="bg-celeste text-negro border-2 border-negro w-12 h-12 flex items-center justify-center shrink-0 shadow-retro-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-azul-oscuro text-lg uppercase tracking-wide font-rajdhani">Plan Curricular</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Permite explorar los diferentes grados y periodos académicos. Al entrar en un periodo, podrás ver todos los temas asociados, leer su Cuadro Teórico y visualizar su contenido dinámico de clase.
                  </p>
                </div>
              </div>

              {/* Opción: Creador de Temas */}
              <div className="flex gap-4">
                <div className="bg-celeste text-negro border-2 border-negro w-12 h-12 flex items-center justify-center shrink-0 shadow-retro-sm">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-azul-oscuro text-lg uppercase tracking-wide font-rajdhani">Creador de Temas</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Herramienta exclusiva para Docentes. Es un editor visual por bloques (títulos, párrafos, galerías de imágenes, tablas, quizzes) que te permite diseñar clases 100% interactivas sin necesidad de escribir una sola línea de código.
                  </p>
                </div>
              </div>

              {/* Opción: Quizzes */}
              <div className="flex gap-4">
                <div className="bg-celeste text-negro border-2 border-negro w-12 h-12 flex items-center justify-center shrink-0 shadow-retro-sm">
                  <HelpIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-azul-oscuro text-lg uppercase tracking-wide font-rajdhani">Gestión de Quizzes</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Módulo de administración donde los profesores pueden crear bancos de preguntas, configurar evaluaciones (tiempo límite, opciones múltiples, selección única) y revisar resultados.
                  </p>
                </div>
              </div>

              {/* Opción: Minijuegos */}
              <div className="flex gap-4">
                <div className="bg-celeste text-negro border-2 border-negro w-12 h-12 flex items-center justify-center shrink-0 shadow-retro-sm">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-azul-oscuro text-lg uppercase tracking-wide font-rajdhani">Mis Juegos</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Acceso al catálogo interactivo de actividades gamificadas. Aquí los estudiantes pueden jugar Sopas de Letras y otras dinámicas orientadas a afianzar conocimientos mediante el juego.
                  </p>
                </div>
              </div>

              {/* Opción: Evaluaciones */}
              <div className="flex gap-4">
                <div className="bg-celeste text-negro border-2 border-negro w-12 h-12 flex items-center justify-center shrink-0 shadow-retro-sm">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-azul-oscuro text-lg uppercase tracking-wide font-rajdhani">Mis Evaluaciones</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Espacio para estudiantes donde se listan las pruebas pendientes y completadas, mostrando las puntuaciones y el progreso individual.
                  </p>
                </div>
              </div>

              {/* Opción: Usuarios */}
              <div className="flex gap-4">
                <div className="bg-celeste text-negro border-2 border-negro w-12 h-12 flex items-center justify-center shrink-0 shadow-retro-sm">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-azul-oscuro text-lg uppercase tracking-wide font-rajdhani">Gestión de Usuarios</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Panel de administración estricto. Permite dar de alta a nuevos usuarios, modificar sus roles (Docente, Estudiante, Administrador) y visualizar los registros generales de acceso al sistema.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Sidebar Derecha (Barra Superior y Tips) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-gray-100 border-2 border-negro shadow-retro p-4 select-none">
            <h2 className="font-extrabold font-mono text-sm uppercase text-azul-oscuro mb-4 border-b-2 border-negro pb-2 flex items-center gap-2">
              <MousePointer2 className="w-4 h-4" />
              Barra Superior de Tareas
            </h2>
            <div className="flex flex-col gap-5 text-sm text-gray-700">
              <div>
                <strong className="block text-negro font-rajdhani uppercase tracking-wide">Menú Estilo Ventana:</strong>
                Son los menús retro ("Archivo", "Nuevo Tema", "Ver", "Ayuda") diseñados para accesos rápidos. ¡Justo donde diste clic para llegar aquí!
              </div>
              <div>
                <strong className="block text-negro font-rajdhani uppercase tracking-wide">Ruta Simulada:</strong>
                Este cuadro con estética <code className="bg-gray-200 px-1 border border-gray-400">C:\EntrenaTec\...</code> te indica exactamente en qué módulo estás navegando dentro de la red.
              </div>
              <div>
                <strong className="block text-negro font-rajdhani uppercase tracking-wide">Terminal / Reloj:</strong>
                Un pequeño widget retro que muestra en tiempo real la hora de tu conexión, manteniendo inmersiva la experiencia del OS.
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-600 shadow-retro p-4 select-none">
            <h2 className="font-extrabold font-mono text-sm uppercase text-yellow-800 mb-2">
              ¿Sabías que?
            </h2>
            <p className="text-xs text-yellow-900 font-mono leading-relaxed">
              El <strong>Constructor Visual de Temas</strong> es la herramienta más potente de EntrenaTec. Puedes arrastrar y ordenar componentes libremente. Cada bloque creado funciona de manera independiente, impidiendo cualquier tipo de error visual global.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
