import React, { useState, useEffect } from 'react';
import { ArrowLeft, HelpCircle, Plus, Trash2, Save, BookOpen } from 'lucide-react';
import usarGestorQuizzes from '../hooks/usarGestorQuizzes';
import { Alerta } from '@/compartido/utilidades/Alerta';

export default function GestionQuizzesPagina() {
  const { quizzes, cargando, error, opciones, cargarQuizzes, crearQuiz, cargarOpciones } = usarGestorQuizzes();
  const [vista, setVista] = useState('lista'); // 'lista' o 'crear'

  // Estado del formulario de creación
  const [quizForm, setQuizForm] = useState({
    titulo: '',
    descripcion: '',
    tema_id: '',
    grado_id: '',
    materia_id: '',
    periodo_id: '',
    tiempo_limite: 45,
    puntaje_aprobacion: 70,
    intentos_maximos: 2,
    estado: 'PUBLICADO',
    preguntas: []
  });

  useEffect(() => {
    if (vista === 'lista') {
      cargarQuizzes();
    }
  }, [vista, cargarQuizzes]);

  useEffect(() => {
    cargarOpciones();
  }, [cargarOpciones]);

  const agregarPregunta = () => {
    setQuizForm(prev => ({
      ...prev,
      preguntas: [
        ...prev.preguntas,
        {
          pregunta: '',
          tipo: 'SELECCION_UNICA',
          puntaje: 10,
          orden: prev.preguntas.length + 1,
          respuestas: [
            { respuesta: '', es_correcta: true },
            { respuesta: '', es_correcta: false }
          ]
        }
      ]
    }));
  };

  const actualizarPregunta = (pIndex, campo, valor) => {
    const nuevasPreguntas = [...quizForm.preguntas];
    nuevasPreguntas[pIndex][campo] = valor;
    setQuizForm({ ...quizForm, preguntas: nuevasPreguntas });
  };

  const eliminarPregunta = (pIndex) => {
    const nuevasPreguntas = quizForm.preguntas.filter((_, i) => i !== pIndex);
    // Reordenar
    const preguntasReordenadas = nuevasPreguntas.map((p, i) => ({ ...p, orden: i + 1 }));
    setQuizForm({ ...quizForm, preguntas: preguntasReordenadas });
  };

  const agregarRespuesta = (pIndex) => {
    const nuevasPreguntas = [...quizForm.preguntas];
    nuevasPreguntas[pIndex].respuestas.push({ respuesta: '', es_correcta: false });
    setQuizForm({ ...quizForm, preguntas: nuevasPreguntas });
  };

  const actualizarRespuesta = (pIndex, rIndex, campo, valor) => {
    const nuevasPreguntas = [...quizForm.preguntas];
    const tipo = nuevasPreguntas[pIndex].tipo;
    
    // Si es seleccion unica o verdadero/falso, solo puede haber una respuesta correcta
    if (campo === 'es_correcta' && valor === true && ['SELECCION_UNICA', 'VERDADERO_FALSO'].includes(tipo)) {
      nuevasPreguntas[pIndex].respuestas = nuevasPreguntas[pIndex].respuestas.map((r, i) => ({
        ...r,
        es_correcta: i === rIndex
      }));
    } else {
      nuevasPreguntas[pIndex].respuestas[rIndex][campo] = valor;
    }
    
    setQuizForm({ ...quizForm, preguntas: nuevasPreguntas });
  };

  const eliminarRespuesta = (pIndex, rIndex) => {
    const nuevasPreguntas = [...quizForm.preguntas];
    nuevasPreguntas[pIndex].respuestas = nuevasPreguntas[pIndex].respuestas.filter((_, i) => i !== rIndex);
    setQuizForm({ ...quizForm, preguntas: nuevasPreguntas });
  };

  const guardarQuiz = async () => {
    try {
      const payload = {
        ...quizForm,
        tema_id: quizForm.tema_id || null,
        grado_id: quizForm.grado_id || null,
        materia_id: quizForm.materia_id || null,
        periodo_id: quizForm.periodo_id || null,
      };
      await crearQuiz(payload);
      Alerta.exito('Guardado_Exitoso.exe', 'Quiz creado con éxito');
      setVista('lista');
      // Reset form
      setQuizForm({
        titulo: '', descripcion: '', tema_id: '', grado_id: '', materia_id: '', periodo_id: '',
        tiempo_limite: 45, puntaje_aprobacion: 70, intentos_maximos: 2, estado: 'PUBLICADO', preguntas: []
      });
    } catch (error) {
      Alerta.error('Fallo_Critico.exe', 'Error: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Botón de Retorno */}
      {vista === 'crear' && (
        <div>
          <button 
            onClick={() => setVista('lista')}
            className="bg-white text-negro border-2 border-negro px-3 py-1.5 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-gray-100 active:translate-y-0.5 active:shadow-none inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Listado
          </button>
        </div>
      )}

      {/* Cabecera */}
      <div className="bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1 flex items-center gap-2 font-mono text-xs uppercase">
          <HelpCircle className="w-4 h-4 text-celeste" />
          <span>Gestor_Evaluaciones.exe</span>
        </div>
        <div className="p-5 bg-white border-b-2 border-negro flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0">
              {vista === 'lista' ? 'Quizzes y Evaluaciones' : 'Creador de Quizzes'}
            </h1>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              {vista === 'lista' ? 'Administra los exámenes y pruebas del sistema.' : 'Diseña pruebas interactivas con validación inmediata.'}
            </p>
          </div>
          {vista === 'lista' && (
            <button 
              onClick={() => setVista('crear')}
              className="bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold font-mono text-xs uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              + Crear Nuevo Quiz
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-negro p-4 font-mono text-xs text-red-800 shadow-retro">
          [X] ERROR DEL SISTEMA: {error}
        </div>
      )}

      {/* Área Principal */}
      <div className="bg-white border-2 border-negro shadow-retro p-6 min-h-[400px]">
        {vista === 'lista' ? (
          <div className="flex flex-col gap-4">
            {cargando ? (
              <div className="text-center font-mono text-sm py-12 text-gray-500">
                [ Cargando evaluaciones... ]
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center border-2 border-dashed border-gray-400 p-12 text-gray-500 font-mono text-sm">
                [ No hay quizzes registrados en el sistema. Presiona "Crear Nuevo Quiz" para comenzar. ]
              </div>
            ) : (
              <div className="overflow-x-auto border-2 border-negro">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-azul-oscuro text-white border-b-2 border-negro uppercase">
                      <th className="p-3 border-r border-negro">Título</th>
                      <th className="p-3 border-r border-negro text-center">Tipo</th>
                      <th className="p-3 border-r border-negro text-center">Aprobación</th>
                      <th className="p-3 border-r border-negro text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-negro">
                    {quizzes.map(q => (
                      <tr key={q.id} className="hover:bg-gray-50">
                        <td className="p-3 border-r border-negro font-bold text-azul-oscuro">{q.titulo}</td>
                        <td className="p-3 border-r border-negro text-center">
                          {q.tema_id ? 'POR TEMA' : 'GLOBAL'}
                        </td>
                        <td className="p-3 border-r border-negro text-center">{q.puntaje_aprobacion}%</td>
                        <td className="p-3 border-r border-negro text-center">
                          <span className="px-2 py-0.5 border border-green-600 bg-green-100 text-green-800 font-bold rounded-sm uppercase text-[10px]">
                            {q.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Formulario de Configuración Básica */}
            <div className="bg-gray-50 border-2 border-negro p-4">
              <h2 className="text-lg font-bold font-mono text-azul-oscuro uppercase border-b-2 border-negro pb-2 mb-4">
                1. Configuración del Quiz
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Título del Quiz *</label>
                  <input 
                    type="text" 
                    value={quizForm.titulo}
                    onChange={(e) => setQuizForm({...quizForm, titulo: e.target.value})}
                    placeholder="Ej. Examen Final HTML..."
                    className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Descripción</label>
                  <textarea 
                    value={quizForm.descripcion}
                    onChange={(e) => setQuizForm({...quizForm, descripcion: e.target.value})}
                    rows="2"
                    className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white resize-y"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Grado (Para global)</label>
                  <select 
                    value={quizForm.grado_id}
                    onChange={(e) => setQuizForm({...quizForm, grado_id: e.target.value})}
                    className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white cursor-pointer"
                  >
                    <option value="">- Global / Ninguno -</option>
                    {opciones.grados.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Periodo (Para global)</label>
                  <select 
                    value={quizForm.periodo_id}
                    onChange={(e) => setQuizForm({...quizForm, periodo_id: e.target.value})}
                    className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white cursor-pointer"
                  >
                    <option value="">- Global / Ninguno -</option>
                    {opciones.periodos.map(p => <option key={p.id} value={p.id}>{p.nombre || `Periodo ${p.numero}`}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Tema (Opcional, para Quiz por Tema)</label>
                  <select 
                    value={quizForm.tema_id}
                    onChange={(e) => setQuizForm({...quizForm, tema_id: e.target.value})}
                    className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white cursor-pointer"
                  >
                    <option value="">- No asociar a Tema -</option>
                    {opciones.temas.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Minutos</label>
                    <input 
                      type="number" 
                      value={quizForm.tiempo_limite}
                      onChange={(e) => setQuizForm({...quizForm, tiempo_limite: e.target.value})}
                      className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-gray-700 mb-1">% Aprob.</label>
                    <input 
                      type="number" 
                      value={quizForm.puntaje_aprobacion}
                      onChange={(e) => setQuizForm({...quizForm, puntaje_aprobacion: e.target.value})}
                      className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Intentos</label>
                    <input 
                      type="number" 
                      value={quizForm.intentos_maximos}
                      onChange={(e) => setQuizForm({...quizForm, intentos_maximos: e.target.value})}
                      className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Constructor de Preguntas */}
            <div>
              <div className="flex justify-between items-center border-b-2 border-negro pb-2 mb-4">
                <h2 className="text-lg font-bold font-mono text-azul-oscuro uppercase">
                  2. Preguntas ({quizForm.preguntas.length})
                </h2>
                <button 
                  onClick={agregarPregunta}
                  className="bg-yellow-100 text-yellow-900 border-2 border-yellow-600 px-3 py-1 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-yellow-500 hover:text-white active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Agregar Pregunta
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {quizForm.preguntas.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-400 p-8 text-center text-gray-500 font-mono text-xs">
                    No has agregado ninguna pregunta al Quiz.
                  </div>
                ) : (
                  quizForm.preguntas.map((p, pIndex) => (
                    <div key={pIndex} className="border-2 border-negro bg-white shadow-retro-sm">
                      <div className="bg-azul-secundario text-white px-3 py-1.5 flex justify-between items-center font-mono text-xs font-bold uppercase">
                        <span>Pregunta #{pIndex + 1}</span>
                        <button onClick={() => eliminarPregunta(pIndex)} className="text-red-300 hover:text-white p-0.5">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="p-4 flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-mono font-bold text-gray-500 mb-1 uppercase">Enunciado</label>
                            <input 
                              type="text"
                              value={p.pregunta}
                              onChange={(e) => actualizarPregunta(pIndex, 'pregunta', e.target.value)}
                              placeholder="Escribe la pregunta..."
                              className="w-full border border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-gray-500 mb-1 uppercase">Tipo</label>
                            <select 
                              value={p.tipo}
                              onChange={(e) => actualizarPregunta(pIndex, 'tipo', e.target.value)}
                              className="w-full border border-black p-2 outline-none text-xs bg-white cursor-pointer font-bold"
                            >
                              <option value="SELECCION_UNICA">Selección Única</option>
                              <option value="SELECCION_MULTIPLE">Múltiple</option>
                              <option value="VERDADERO_FALSO">Verdadero/Falso</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-gray-500 mb-1 uppercase">Puntos</label>
                            <input 
                              type="number"
                              value={p.puntaje}
                              onChange={(e) => actualizarPregunta(pIndex, 'puntaje', e.target.value)}
                              className="w-full border border-black p-2 outline-none text-sm bg-white"
                            />
                          </div>
                        </div>

                        {/* Respuestas */}
                        <div className="bg-gray-50 border border-gray-300 p-3">
                          <label className="block text-[10px] font-mono font-bold text-azul-oscuro mb-2 uppercase border-b border-gray-300 pb-1">
                            Opciones de Respuesta
                          </label>
                          <div className="flex flex-col gap-2">
                            {p.respuestas.map((r, rIndex) => (
                              <div key={rIndex} className="flex items-center gap-2">
                                <input 
                                  type={['SELECCION_UNICA', 'VERDADERO_FALSO'].includes(p.tipo) ? 'radio' : 'checkbox'}
                                  name={`pregunta_${pIndex}_correcta`}
                                  checked={r.es_correcta}
                                  onChange={(e) => actualizarRespuesta(pIndex, rIndex, 'es_correcta', e.target.checked)}
                                  className="w-4 h-4 cursor-pointer accent-green-600 shrink-0"
                                />
                                <input 
                                  type="text"
                                  value={r.respuesta}
                                  onChange={(e) => actualizarRespuesta(pIndex, rIndex, 'respuesta', e.target.value)}
                                  placeholder={`Opción ${rIndex + 1}`}
                                  className={`flex-1 border p-1.5 outline-none text-sm ${r.es_correcta ? 'border-green-600 bg-green-50 text-green-900 font-bold' : 'border-gray-400 bg-white'}`}
                                />
                                <button onClick={() => eliminarRespuesta(pIndex, rIndex)} className="p-1.5 bg-red-50 text-red-600 border border-red-300 hover:bg-red-500 hover:text-white cursor-pointer shrink-0">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => agregarRespuesta(pIndex)}
                              className="mt-2 self-start text-[10px] font-bold font-mono text-azul-secundario uppercase hover:underline"
                            >
                              + Añadir opción
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Acción Final */}
            <div className="pt-4 border-t-2 border-negro flex justify-end">
              <button 
                onClick={guardarQuiz}
                disabled={cargando || !quizForm.titulo || quizForm.preguntas.length === 0}
                className={`bg-green-600 text-white border-2 border-negro px-8 py-3 font-bold font-mono text-sm uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-green-500 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Save className="w-5 h-5" />
                {cargando ? 'Guardando...' : 'Guardar y Publicar Quiz'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
