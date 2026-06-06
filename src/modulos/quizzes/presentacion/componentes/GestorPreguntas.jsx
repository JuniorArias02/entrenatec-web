import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Edit, HelpCircle } from 'lucide-react';
import usarGestorQuizzes from '../hooks/usarGestorQuizzes';
import { Alerta } from '@/compartido/utilidades/Alerta';

export default function GestorPreguntas({ quizId, onVolver }) {
  const { cargarQuizCompleto, agregarPreguntaAQuiz, actualizarPregunta, eliminarPregunta, cargando } = usarGestorQuizzes();
  const [quiz, setQuiz] = useState(null);
  
  // Estado para el formulario de la pregunta (si es null, no estamos editando/creando)
  const [preguntaForm, setPreguntaForm] = useState(null);

  const cargarDatos = async () => {
    try {
      const data = await cargarQuizCompleto(quizId);
      setQuiz(data);
    } catch (error) {
      Alerta.error('Error', error.message);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [quizId]);

  const iniciarNuevaPregunta = () => {
    setPreguntaForm({
      id: null,
      pregunta: '',
      tipo: 'SELECCION_UNICA',
      puntaje: 10,
      orden: quiz?.preguntas ? quiz.preguntas.length + 1 : 1,
      respuestas: [
        { respuesta: '', es_correcta: true },
        { respuesta: '', es_correcta: false }
      ]
    });
  };

  const iniciarEdicionPregunta = (pregunta) => {
    // Clonamos para no afectar el original hasta guardar
    setPreguntaForm(JSON.parse(JSON.stringify(pregunta)));
  };

  const cancelarEdicion = () => {
    setPreguntaForm(null);
  };

  // Funciones para manejar el form de la pregunta
  const manejarCambioPregunta = (campo, valor) => {
    setPreguntaForm({ ...preguntaForm, [campo]: valor });
  };

  const agregarRespuestaForm = () => {
    const nuevasRespuestas = [...preguntaForm.respuestas, { respuesta: '', es_correcta: false }];
    setPreguntaForm({ ...preguntaForm, respuestas: nuevasRespuestas });
  };

  const manejarCambioRespuesta = (rIndex, campo, valor) => {
    const nuevasRespuestas = [...preguntaForm.respuestas];
    const tipo = preguntaForm.tipo;
    
    if (campo === 'es_correcta' && valor === true && ['SELECCION_UNICA', 'VERDADERO_FALSO'].includes(tipo)) {
      nuevasRespuestas.forEach((r, i) => r.es_correcta = (i === rIndex));
    } else {
      nuevasRespuestas[rIndex][campo] = valor;
    }
    
    setPreguntaForm({ ...preguntaForm, respuestas: nuevasRespuestas });
  };

  const eliminarRespuestaForm = (rIndex) => {
    const nuevasRespuestas = preguntaForm.respuestas.filter((_, i) => i !== rIndex);
    setPreguntaForm({ ...preguntaForm, respuestas: nuevasRespuestas });
  };

  const guardarPregunta = async () => {
    try {
      if (preguntaForm.id) {
        await actualizarPregunta(preguntaForm.id, preguntaForm);
        Alerta.exito('Guardado_Exitoso.exe', 'Pregunta actualizada con éxito');
      } else {
        await agregarPreguntaAQuiz(quizId, preguntaForm);
        Alerta.exito('Guardado_Exitoso.exe', 'Pregunta agregada con éxito');
      }
      setPreguntaForm(null);
      cargarDatos(); // Recargar el quiz con la nueva info
    } catch (error) {
      Alerta.error('Fallo_Critico.exe', 'Error: ' + error.message);
    }
  };

  const confirmarEliminarPregunta = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta pregunta?')) {
      try {
        await eliminarPregunta(id);
        Alerta.exito('Eliminado.exe', 'Pregunta eliminada con éxito');
        cargarDatos();
      } catch (error) {
        Alerta.error('Error', error.message);
      }
    }
  };

  if (!quiz) return <div className="text-center p-12 font-mono text-gray-500">Cargando datos del quiz...</div>;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="flex justify-between items-center bg-gray-50 border-2 border-negro p-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-azul-oscuro uppercase">Gestionar Preguntas</h2>
          <p className="text-sm text-gray-600 font-medium">Quiz: {quiz.titulo}</p>
        </div>
        <button 
          onClick={onVolver}
          className="bg-white text-negro border-2 border-negro px-3 py-1.5 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-gray-100 active:translate-y-0.5 active:shadow-none inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>

      {preguntaForm ? (
        <div className="border-2 border-negro bg-white shadow-retro">
          <div className="bg-azul-oscuro text-white px-3 py-2 flex items-center gap-2 font-mono text-sm font-bold uppercase">
            <Edit className="w-4 h-4 text-celeste" />
            {preguntaForm.id ? 'Editar Pregunta' : 'Nueva Pregunta'}
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono font-bold text-gray-500 mb-1 uppercase">Enunciado</label>
                <input 
                  type="text"
                  value={preguntaForm.pregunta}
                  onChange={(e) => manejarCambioPregunta('pregunta', e.target.value)}
                  placeholder="Escribe la pregunta..."
                  className="w-full border border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-500 mb-1 uppercase">Tipo</label>
                <select 
                  value={preguntaForm.tipo}
                  onChange={(e) => manejarCambioPregunta('tipo', e.target.value)}
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
                  value={preguntaForm.puntaje}
                  onChange={(e) => manejarCambioPregunta('puntaje', parseInt(e.target.value))}
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
                {preguntaForm.respuestas.map((r, rIndex) => (
                  <div key={rIndex} className="flex items-center gap-2">
                    <input 
                      type={['SELECCION_UNICA', 'VERDADERO_FALSO'].includes(preguntaForm.tipo) ? 'radio' : 'checkbox'}
                      name="respuesta_correcta"
                      checked={r.es_correcta}
                      onChange={(e) => manejarCambioRespuesta(rIndex, 'es_correcta', e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-green-600 shrink-0"
                    />
                    <input 
                      type="text"
                      value={r.respuesta}
                      onChange={(e) => manejarCambioRespuesta(rIndex, 'respuesta', e.target.value)}
                      placeholder={`Opción ${rIndex + 1}`}
                      className={`flex-1 border p-1.5 outline-none text-sm ${r.es_correcta ? 'border-green-600 bg-green-50 text-green-900 font-bold' : 'border-gray-400 bg-white'}`}
                    />
                    <button onClick={() => eliminarRespuestaForm(rIndex)} className="p-1.5 bg-red-50 text-red-600 border border-red-300 hover:bg-red-500 hover:text-white cursor-pointer shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={agregarRespuestaForm}
                  className="mt-2 self-start text-[10px] font-bold font-mono text-azul-secundario uppercase hover:underline cursor-pointer"
                >
                  + Añadir opción
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t-2 border-negro">
              <button 
                onClick={cancelarEdicion}
                className="bg-gray-200 text-negro border-2 border-negro px-4 py-2 font-bold font-mono text-xs uppercase hover:bg-gray-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={guardarPregunta}
                disabled={cargando || !preguntaForm.pregunta}
                className={`bg-green-600 text-white border-2 border-negro px-6 py-2 font-bold font-mono text-xs uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-green-500 active:translate-y-0.5 active:shadow-none flex items-center gap-2 cursor-pointer ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Save className="w-4 h-4" /> {cargando ? 'Guardando...' : 'Guardar Pregunta'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold font-mono text-lg uppercase text-azul-oscuro">Lista de Preguntas ({quiz.preguntas?.length || 0})</h3>
            <button 
              onClick={iniciarNuevaPregunta}
              className="bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold font-mono text-xs uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Agregar Pregunta
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {!quiz.preguntas || quiz.preguntas.length === 0 ? (
              <div className="border-2 border-dashed border-gray-400 p-8 text-center text-gray-500 font-mono text-xs">
                Este quiz no tiene preguntas.
              </div>
            ) : (
              quiz.preguntas.map((p, index) => (
                <div key={p.id} className="border-2 border-negro bg-white flex flex-col md:flex-row justify-between items-start md:items-center p-4 shadow-retro-sm">
                  <div className="flex-1">
                    <span className="font-bold text-azul-secundario mr-2 font-mono">#{index + 1}</span>
                    <span className="font-bold text-sm text-azul-oscuro">{p.pregunta}</span>
                    <div className="flex gap-4 mt-2 font-mono text-[10px] text-gray-600 uppercase">
                      <span>Tipo: {p.tipo.replace('_', ' ')}</span>
                      <span>Puntaje: {p.puntaje}</span>
                      <span>Opciones: {p.respuestas?.length || 0}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button 
                      onClick={() => iniciarEdicionPregunta(p)}
                      className="bg-yellow-100 text-yellow-800 border border-yellow-600 px-3 py-1.5 font-bold font-mono text-[10px] uppercase hover:bg-yellow-500 hover:text-white cursor-pointer"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => confirmarEliminarPregunta(p.id)}
                      className="bg-red-100 text-red-800 border border-red-600 px-3 py-1.5 font-bold font-mono text-[10px] uppercase hover:bg-red-500 hover:text-white cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
