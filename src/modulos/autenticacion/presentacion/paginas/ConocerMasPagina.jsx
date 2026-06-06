import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  School, 
  Globe, 
  Target, 
  Leaf, 
  Lightbulb 
} from 'lucide-react';

export default function ConocerMasPagina() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 py-4 animate-fade-in max-w-5xl mx-auto w-full">
      {/* Botón de volver */}
      <button 
        onClick={() => navigate('/')}
        className="self-start bg-white text-negro border-2 border-negro px-4 py-2 font-bold font-mono text-sm tracking-wide shadow-retro hover:bg-gris-claro active:translate-x-0.5 active:translate-y-0.5 active:shadow-retro-sm transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        VOLVER AL INICIO
      </button>

      {/* Cabecera del Proyecto */}
      <div className="w-full bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-celeste" />
            <span className="font-mono text-xs uppercase font-bold tracking-wider">
              INFO_PROYECTO_INSTITUCIONAL.DOCX
            </span>
          </div>
        </div>

        <div className="p-8 text-center bg-white border-b-2 border-dashed border-gray-300">
          <div className="inline-block bg-yellow-100 text-yellow-800 border-2 border-yellow-400 text-xs font-bold px-3 py-1 uppercase font-mono mb-4">
            ★ PROYECTO EDUCATIVO DE GRADO
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase text-azul-oscuro m-0 leading-none">
            Acerca de Entrena TEC
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-700 max-w-3xl mx-auto mt-4 leading-relaxed">
            Una plataforma educativa diseñada para transformar la manera en que se enseña la informática en la <span className="font-bold text-azul-secundario">Institución Educativa Gonzalo Rivera Laguado</span> de la ciudad de Cúcuta.
          </p>
        </div>

        {/* Contenido Relevante */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 bg-gray-50">
          
          {/* Tarjeta: Objetivo */}
          <div className="bg-white border-2 border-negro p-6 shadow-retro-sm hover:translate-y-1 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-celeste border-2 border-negro p-2">
                <Target className="w-6 h-6 text-negro" />
              </div>
              <h2 className="text-xl font-extrabold uppercase text-azul-oscuro">El Objetivo</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              Resolver la falta de herramientas interactivas y romper con la monotonía de las clases tradicionales de informática. Entrena TEC busca fortalecer las competencias tecnológicas de los estudiantes mediante <span className="font-bold">gamificación</span> (juegos como sopas de letras, quizzes interactivos y módulos visuales), haciendo el aprendizaje moderno, divertido y dinámico.
            </p>
          </div>

          {/* Tarjeta: Impacto Social */}
          <div className="bg-white border-2 border-negro p-6 shadow-retro-sm hover:translate-y-1 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-300 border-2 border-negro p-2">
                <Globe className="w-6 h-6 text-negro" />
              </div>
              <h2 className="text-xl font-extrabold uppercase text-azul-oscuro">Impacto Social</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              Cerramos la brecha de conocimiento tecnológico en nuestra región. La plataforma es <span className="font-bold text-azul-secundario">100% gratuita</span>, eliminando barreras económicas y permitiendo que todos los jóvenes tengan las mismas oportunidades de prepararse para el mundo moderno, ofreciendo a los profesores una herramienta de apoyo innovadora.
            </p>
          </div>

          {/* Tarjeta: Innovación */}
          <div className="bg-white border-2 border-negro p-6 shadow-retro-sm hover:translate-y-1 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-400 border-2 border-negro p-2">
                <Lightbulb className="w-6 h-6 text-negro" />
              </div>
              <h2 className="text-xl font-extrabold uppercase text-azul-oscuro">Visión a Futuro</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              Al brindar una formación tecnológica sólida desde el colegio, preparamos a los estudiantes para los retos del sector tecnológico. Esto no solo beneficia su desarrollo profesional, sino que impulsa el crecimiento educativo y económico de la ciudad de Cúcuta, atrayendo mejores oportunidades.
            </p>
          </div>

          {/* Tarjeta: Impacto Ambiental */}
          <div className="bg-white border-2 border-negro p-6 shadow-retro-sm hover:translate-y-1 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-400 border-2 border-negro p-2">
                <Leaf className="w-6 h-6 text-negro" />
              </div>
              <h2 className="text-xl font-extrabold uppercase text-azul-oscuro">Sostenibilidad</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              Fomentamos una cultura ecológica. Al trasladar el aprendizaje y la evaluación a un entorno completamente digital, reducimos drásticamente el consumo de papel e impresiones dentro de la institución, apoyando la reducción de la huella ecológica escolar.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
