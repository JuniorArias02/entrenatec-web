import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Award, AlertTriangle, Monitor } from 'lucide-react';
import usarGestorQuizzes from '../hooks/usarGestorQuizzes';
import { Alerta } from '@/compartido/utilidades/Alerta';

export default function RealizarQuizPagina() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { cargarQuizCompleto, evaluarQuiz, cargando } = usarGestorQuizzes();
  
  const [quiz, setQuiz] = useState(null);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState({});
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await cargarQuizCompleto(quizId);
        setQuiz(datos);
      } catch (error) {
        Alerta.error('Error', 'No se pudo cargar la evaluación.');
      }
    };
    cargar();
  }, [quizId, cargarQuizCompleto]);

  const manejarSeleccion = (preguntaId, respuestaId, tipo) => {
    if (tipo === 'SELECCION_MULTIPLE') {
      setRespuestasSeleccionadas(prev => {
        const prevSeleccion = prev[preguntaId] || [];
        if (prevSeleccion.includes(respuestaId)) {
          return { ...prev, [preguntaId]: prevSeleccion.filter(id => id !== respuestaId) };
        } else {
          return { ...prev, [preguntaId]: [...prevSeleccion, respuestaId] };
        }
      });
    } else {
      // SELECCION_UNICA o VERDADERO_FALSO
      setRespuestasSeleccionadas(prev => ({ ...prev, [preguntaId]: [respuestaId] }));
    }
  };

  const enviarEvaluacion = async () => {
    // Validar que se hayan respondido todas
    const preguntasSinResponder = quiz.preguntas.filter(p => !respuestasSeleccionadas[p.id] || respuestasSeleccionadas[p.id].length === 0);
    if (preguntasSinResponder.length > 0) {
      if (!window.confirm(`Te faltan responder ${preguntasSinResponder.length} preguntas. ¿Seguro que deseas entregar el quiz así?`)) {
        return;
      }
    }

    // Construir payload
    const arrayRespuestas = [];
    Object.keys(respuestasSeleccionadas).forEach(pId => {
      const respIds = respuestasSeleccionadas[pId];
      respIds.forEach(rId => {
        arrayRespuestas.push({
          pregunta_id: parseInt(pId),
          respuesta_id: parseInt(rId)
        });
      });
    });

    try {
      const datosRespuesta = await evaluarQuiz(quizId, arrayRespuestas);
      setResultado(datosRespuesta);
      Alerta.exito('Evaluación Completada', 'Tus respuestas han sido enviadas y procesadas.');
    } catch (error) {
      Alerta.error('Error al evaluar', error.message);
    }
  };

  if (!quiz) {
    return (
      <div className="flex justify-center items-center py-12 select-none">
        <div className="bg-white border-2 border-negro shadow-retro p-4 font-mono text-xs uppercase animate-pulse">
          Ejecutando Compilador de Evaluación...
        </div>
      </div>
    );
  }

  // Vista de Resultados
  if (resultado) {
    return (
      <div className="flex flex-col gap-6 py-2 animate-fade-in max-w-3xl mx-auto w-full">
        <div className="bg-white border-2 border-negro shadow-retro p-1 select-none">
          <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center gap-2 font-mono text-xs uppercase">
            <Award className="w-4 h-4 text-celeste" />
            <span>Reporte_Calificacion.exe</span>
          </div>
          <div className="p-8 bg-white border-t border-gray-300 text-center flex flex-col items-center">
            <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0 mb-2">
              Resultados de la Evaluación
            </h1>
            <p className="font-mono text-sm text-gray-600 mb-6">{quiz.titulo}</p>
            
            <div className={`border-4 p-6 w-full max-w-md border-negro shadow-[4px_4px_0px_rgba(0,0,0,1)] ${resultado.aprobado ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-mono text-xs font-bold text-gray-600 mb-2 uppercase">Puntaje Obtenido</div>
              <div className={`text-6xl font-extrabold ${resultado.aprobado ? 'text-green-700' : 'text-red-700'}`}>
                {resultado.puntaje_obtenido}
              </div>
              <div className={`mt-4 text-2xl font-black uppercase ${resultado.aprobado ? 'text-green-800' : 'text-red-800'}`}>
                {resultado.nivel_desempeno || (resultado.aprobado ? 'APROBADO' : 'NO APROBADO')}
              </div>
              <div className="mt-4 font-mono font-bold text-xs uppercase text-gray-800 border-t-2 border-negro pt-3">
                Estado Final: {resultado.aprobado ? 'APROBADO' : 'NO APROBADO'}
              </div>
            </div>

            <button 
              onClick={() => navigate('/inicio')}
              className="mt-8 bg-celeste text-negro border-2 border-negro px-6 py-3 font-bold font-mono text-sm uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in max-w-4xl mx-auto w-full">
      {/* Botón de Retorno */}
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="bg-white text-negro border-2 border-negro px-3 py-1.5 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-gray-100 active:translate-y-0.5 active:shadow-none inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Abandonar Quiz
        </button>
      </div>

      {/* Cabecera del Quiz */}
      <div className="bg-white border-2 border-negro shadow-retro p-1 select-none">
        <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center justify-between font-mono text-xs uppercase">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-celeste" />
            <span>Sistema_Evaluacion.exe</span>
          </div>
          <div>
            <span className="font-bold text-celeste">Aprobación: {quiz.puntaje_aprobacion}%</span>
          </div>
        </div>
        <div className="p-5 bg-white border-t border-gray-300">
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase text-azul-oscuro m-0">
            {quiz.titulo}
          </h1>
          {quiz.descripcion && (
            <p className="mt-2 text-gray-700 font-medium">
              {quiz.descripcion}
            </p>
          )}
        </div>
      </div>

      {/* Preguntas */}
      <div className="flex flex-col gap-6">
        {quiz.preguntas && quiz.preguntas.length > 0 ? (
          quiz.preguntas.map((pregunta, pIndex) => (
            <div key={pregunta.id} className="bg-white border-2 border-negro shadow-retro">
              <div className="bg-gray-100 border-b-2 border-negro p-3 flex justify-between items-center">
                <span className="font-bold font-mono text-azul-oscuro uppercase">Pregunta {pIndex + 1}</span>
                <span className="font-bold font-mono text-[10px] bg-white border border-black px-2 py-0.5">{pregunta.puntaje} Pts</span>
              </div>
              <div className="p-5">
                <p className="text-lg font-bold text-negro mb-4">{pregunta.pregunta}</p>
                <div className="flex flex-col gap-3">
                  {pregunta.respuestas.map(respuesta => {
                    const estaSeleccionada = respuestasSeleccionadas[pregunta.id]?.includes(respuesta.id);
                    const isMultiple = pregunta.tipo === 'SELECCION_MULTIPLE';

                    return (
                      <label 
                        key={respuesta.id}
                        className={`flex items-start gap-3 p-3 border-2 transition-all cursor-pointer ${estaSeleccionada ? 'border-azul-secundario bg-blue-50' : 'border-gray-200 hover:border-black'}`}
                      >
                        <div className="pt-0.5">
                          <input 
                            type={isMultiple ? "checkbox" : "radio"}
                            name={`pregunta_${pregunta.id}`}
                            checked={estaSeleccionada || false}
                            onChange={() => manejarSeleccion(pregunta.id, respuesta.id, pregunta.tipo)}
                            className="w-4 h-4 accent-azul-secundario cursor-pointer"
                          />
                        </div>
                        <span className={`text-sm ${estaSeleccionada ? 'font-bold text-azul-oscuro' : 'text-gray-700'}`}>
                          {respuesta.respuesta}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-500 p-6 text-center font-mono text-yellow-800">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            Este quiz no tiene preguntas configuradas aún.
          </div>
        )}
      </div>

      {/* Acciones */}
      {quiz.preguntas && quiz.preguntas.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button 
            onClick={enviarEvaluacion}
            disabled={cargando}
            className={`bg-green-600 text-white border-2 border-negro px-8 py-4 font-bold font-mono text-sm uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-green-500 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <CheckSquare className="w-5 h-5" />
            {cargando ? 'Evaluando...' : 'Finalizar y Enviar Evaluación'}
          </button>
        </div>
      )}
    </div>
  );
}
