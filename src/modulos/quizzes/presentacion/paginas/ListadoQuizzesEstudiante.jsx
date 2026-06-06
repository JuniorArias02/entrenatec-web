import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Play } from 'lucide-react';
import usarGestorQuizzes from '../hooks/usarGestorQuizzes';

export default function ListadoQuizzesEstudiante() {
  const { quizzes, cargando, error, cargarQuizzes } = usarGestorQuizzes();
  const navigate = useNavigate();

  useEffect(() => {
    cargarQuizzes(); // O cargarQuizzes({ estado: 'PUBLICADO' }) si el backend lo soporta
  }, [cargarQuizzes]);

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Cabecera */}
      <div className="bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1 flex items-center gap-2 font-mono text-xs uppercase">
          <HelpCircle className="w-4 h-4 text-celeste" />
          <span>Centro_Evaluaciones.exe</span>
        </div>
        <div className="p-5 bg-white border-b-2 border-negro flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0">
              Evaluaciones Disponibles
            </h1>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              Selecciona un quiz de la lista para poner a prueba tus conocimientos.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-negro p-4 font-mono text-xs text-red-800 shadow-retro">
          [X] ERROR DEL SISTEMA: {error}
        </div>
      )}

      {/* Lista de Quizzes */}
      <div className="bg-white border-2 border-negro shadow-retro p-6 min-h-[400px]">
        {cargando ? (
          <div className="text-center font-mono text-sm py-12 text-gray-500">
            [ Buscando evaluaciones en el servidor... ]
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center border-2 border-dashed border-gray-400 p-12 text-gray-500 font-mono text-sm">
            [ No hay evaluaciones disponibles en este momento. ]
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="border-2 border-negro bg-white shadow-retro-sm flex flex-col hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
                <div className="bg-gris-claro border-b-2 border-negro p-3 flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold uppercase text-azul-secundario">ID: {quiz.id}</span>
                  <span className="font-mono text-[10px] font-bold uppercase border border-black px-1.5 py-0.5 bg-white">
                    {quiz.puntaje_aprobacion}% Aprob.
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-lg text-azul-oscuro uppercase mb-2 line-clamp-2">{quiz.titulo}</h3>
                  <p className="text-xs text-gray-600 mb-4 line-clamp-3 flex-1">{quiz.descripcion || 'Sin descripción'}</p>
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t-2 border-dashed border-gray-300">
                    <span className="font-mono text-xs font-bold text-gray-500">
                      {quiz.tiempo_limite} min
                    </span>
                    <button 
                      onClick={() => navigate(`/quizzes/${quiz.id}/realizar`)}
                      className="bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold font-mono text-[10px] uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Resolver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
