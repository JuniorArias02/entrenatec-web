import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';
import {
  Monitor,
  Heart,
  Users,
  Gamepad2,
  Sparkles,
  Play,
  GraduationCap,
  Award,
  BookOpen
} from 'lucide-react';
import { VERSION_SISTEMA } from '@/compartido/constantes/version';

export default function LandingPagina() {
  const { abrirLogin } = useOutletContext();
  const navigate = useNavigate();
  const { estaAutenticado } = usarAutenticacion();

  const integrantes = [
    "Loren Nicol Duarte Cruz",
    "Maria Jose Oliveros Jimenez",
    "Nicolle Dayana Alavares Rojas",
    "Ender Jose Cardenas Rangel",
    "Johan Sebastian Fernandez",
    "Darwin Andrey"
  ];

  return (
    <div className="flex flex-col gap-8 py-4 animate-fade-in max-w-6xl mx-auto w-full">
      {/* 1. HERO BANNER: Presentación del Proyecto */}
      <div className="w-full bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-celeste" />
            <span className="font-mono text-xs uppercase font-bold tracking-wider">
              PROYECTO_DE_GRADO_2025.EXE
            </span>
          </div>
          <div className="bg-celeste text-negro text-[10px] font-bold px-1.5 border border-negro uppercase">
            v{VERSION_SISTEMA}
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="inline-flex self-start items-center gap-2 bg-yellow-100 text-yellow-800 border-2 border-yellow-400 text-xs font-bold px-3 py-1 uppercase font-mono">
              <Award className="w-4 h-4" /> Doble Titulación - Media Técnica
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-azul-oscuro m-0 leading-none">
              ENTRENA TEC
            </h1>
            <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed bg-white/80 p-2 border border-dashed border-gray-300">
              Plataforma interactiva para aprender informática. Un proyecto hecho con <Heart className="w-5 h-5 inline text-red-500 fill-current" /> por estudiantes, para estudiantes de la <span className="font-bold text-azul-secundario">Institución Educativa Gonzalo Rivera Laguado</span>.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              {estaAutenticado ? (
                <button
                  onClick={() => navigate('/inicio')}
                  className="bg-celeste text-negro border-2 border-negro px-6 py-3 font-bold text-sm tracking-wide shadow-retro hover:bg-azul-secundario hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-retro-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  ENTRAR A ESTUDIAR
                </button>
              ) : (
                <button
                  onClick={abrirLogin}
                  className="bg-celeste text-negro border-2 border-negro px-6 py-3 font-bold text-sm tracking-wide shadow-retro hover:bg-azul-secundario hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-retro-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  INICIAR SESIÓN
                </button>
              )}
              <button
                onClick={() => navigate('/conocer-mas')}
                className="bg-white text-negro border-2 border-negro px-6 py-3 font-bold text-sm tracking-wide shadow-retro hover:bg-gris-claro active:translate-x-0.5 active:translate-y-0.5 active:shadow-retro-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                LEER EL PROYECTO
              </button>
            </div>
          </div>

          {/* Gráfico Retro / Ficha Técnica */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="w-full bg-gris-claro border-2 border-negro relative flex flex-col shadow-retro p-1">
              <div className="bg-negro text-white px-2 py-1 font-mono text-[10px] uppercase flex justify-between">
                <span>FICHA_TECNICA.DAT</span>
                <span>SENA</span>
              </div>
              <div className="bg-white border-2 border-black p-4 text-left shadow-retro-sm flex flex-col gap-2 font-mono text-xs">
                <div className="border-b border-dashed border-gray-300 pb-2 mb-1">
                  <span className="font-bold text-gray-500">PROGRAMA:</span><br/>
                  <span className="text-azul-oscuro font-bold uppercase">Técnico en Sistemas Tele informáticos</span>
                </div>
                <div>
                  <span className="font-bold text-gray-500">CÓDIGO:</span> 233108 v1
                </div>
                <div>
                  <span className="font-bold text-gray-500">FICHA:</span> 3156695
                </div>
                <div>
                  <span className="font-bold text-gray-500">VIGENCIA:</span> 2025 - 2026
                </div>
                <div className="mt-2 text-center">
                  <Monitor className="w-12 h-12 text-azul-secundario mx-auto animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EL EQUIPO CREADOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Lista de Integrantes */}
        <div className="md:col-span-2 bg-white border-2 border-negro shadow-retro p-1">
          <div className="bg-azul-secundario text-white px-3 py-1 flex items-center gap-2 font-bold text-xs uppercase">
            <Users className="w-4 h-4" />
            <span>EQUIPO_DESARROLLADOR.TXT</span>
          </div>
          <div className="p-6 md:p-8 bg-white border border-t-0 border-gray-300">
            <h2 className="text-2xl font-extrabold uppercase text-azul-oscuro mb-2">
              Los Creadores
            </h2>
            <p className="text-sm text-gray-500 font-mono mb-6">
              Jóvenes apasionados por la tecnología, construyendo el futuro de la educación en Cúcuta.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {integrantes.map((nombre, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border-2 border-negro hover:bg-celeste hover:-translate-y-1 transition-transform cursor-default bg-gray-50 shadow-[2px_2px_0px_0px_#000000]">
                  <div className="w-8 h-8 bg-azul-oscuro text-white flex items-center justify-center font-bold font-mono text-sm border border-negro shrink-0">
                    0{index + 1}
                  </div>
                  <span className="font-bold text-xs uppercase font-mono tracking-tight text-negro truncate">
                    {nombre}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Misión y Visión Corta */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-white border-2 border-negro shadow-retro p-1 flex-1 flex flex-col">
            <div className="bg-purple-600 text-white px-3 py-1 flex items-center gap-2 font-bold text-xs uppercase">
              <Sparkles className="w-4 h-4" />
              <span>NUESTRA_MISION.INI</span>
            </div>
            <div className="p-5 bg-white border border-t-0 border-gray-300 flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-extrabold uppercase text-azul-oscuro mb-2">
                Aprender Jugando
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                Queremos dejar atrás las clases monótonas. Traemos la tecnología directamente a las aulas del Gonzalo Rivera Laguado, integrando juegos, retos y un diseño dinámico para que aprender informática sea una experiencia genial.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-negro shadow-retro p-1 flex-1 flex flex-col">
            <div className="bg-emerald-600 text-white px-3 py-1 flex items-center gap-2 font-bold text-xs uppercase">
              <Gamepad2 className="w-4 h-4" />
              <span>PLATAFORMA_GAMIFICADA.CFG</span>
            </div>
            <div className="p-5 bg-white border border-t-0 border-gray-300 flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-extrabold uppercase text-azul-oscuro mb-2">
                Totalmente Gratis
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                Creemos en la igualdad de oportunidades. Entrena TEC es un recurso libre para nuestra institución, ayudando a cerrar la brecha digital en nuestra región.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
