import React, { useState, useEffect } from 'react';
import { Layers, Edit3, Eye, Code, Save, Clock, Info, Check, Plus, Trash2 } from 'lucide-react';

/**
 * Gestor de Cuadro Teórico (Edición y Visualización Dinámica Multivalor).
 * Diseñado bajo estética Y2K para definir múltiples ítems por categoría:
 * 1. Componente
 * 2. Competencia
 * 3. Estándares Básicos (E.B.C.)
 * 4. Aprendizaje
 * 5. Evidencia
 * + Intensidad Horaria
 */
export default function GestorCuadroTeorico({ periodo, gradoId, alGuardar }) {
  // Inicializar estado a partir del cuadro teórico del periodo (soporta strings, strings con saltos de línea y arrays)
  const parsearCuadroTeorico = (ct) => {
    const estructuraVacia = {
      componente: [],
      competencia: [],
      estandares: [],
      aprendizaje: [],
      evidencia: [],
      intensidad_horaria: '4 horas semanales'
    };

    if (!ct) return estructuraVacia;

    if (typeof ct === 'object') {
      const parsedObj = {};
      Object.keys(estructuraVacia).forEach(key => {
        if (key === 'intensidad_horaria') {
          parsedObj[key] = ct[key] || '4 horas semanales';
        } else {
          const val = ct[key];
          if (Array.isArray(val)) {
            parsedObj[key] = val;
          } else if (typeof val === 'string' && val.trim() !== '') {
            // Dividir por saltos de línea si es un string largo
            parsedObj[key] = val.split('\n').map(s => s.trim()).filter(Boolean);
          } else {
            parsedObj[key] = [];
          }
        }
      });
      return parsedObj;
    }

    try {
      const parsed = JSON.parse(ct);
      if (typeof parsed === 'object') {
        return parsearCuadroTeorico(parsed);
      }
    } catch (e) {
      // String simple legado
      return {
        ...estructuraVacia,
        componente: ['General'],
        competencia: ct.split('\n').map(s => s.trim()).filter(Boolean)
      };
    }

    return estructuraVacia;
  };

  const [valores, setValores] = useState(() => parsearCuadroTeorico(periodo?.cuadroTeorico));
  const [modo, setModo] = useState('visualizar'); // 'visualizar' | 'editar'
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [apiPayload, setApiPayload] = useState(null);

  // Sincronizar si cambia el periodo
  useEffect(() => {
    setValores(parsearCuadroTeorico(periodo?.cuadroTeorico));
    setGuardadoExitoso(false);
    setApiPayload(null);
  }, [periodo]);

  // Manejar cambio en intensidad horaria (string simple)
  const manejarCambioIntensidad = (e) => {
    setValores(prev => ({
      ...prev,
      intensidad_horaria: e.target.value
    }));
  };

  // Manejar edición de un ítem de array
  const manejarCambioElemento = (categoria, index, nuevoValor) => {
    setValores(prev => {
      const nuevoArray = [...prev[categoria]];
      nuevoArray[index] = nuevoValor;
      return {
        ...prev,
        [categoria]: nuevoArray
      };
    });
  };

  // Agregar fila a una categoría
  const agregarElemento = (categoria) => {
    setValores(prev => ({
      ...prev,
      [categoria]: [...prev[categoria], '']
    }));
  };

  // Eliminar fila de una categoría
  const eliminarElemento = (categoria, index) => {
    setValores(prev => {
      const nuevoArray = prev[categoria].filter((_, idx) => idx !== index);
      return {
        ...prev,
        [categoria]: nuevoArray
      };
    });
  };

  const ejecutarGuardado = (e) => {
    e.preventDefault();

    // Limpiar elementos vacíos antes de enviar
    const valoresLimpios = {};
    Object.keys(valores).forEach(key => {
      if (key === 'intensidad_horaria') {
        valoresLimpios[key] = valores[key];
      } else {
        valoresLimpios[key] = valores[key].map(v => v.trim()).filter(Boolean);
      }
    });

    const payload = {
      grado_id: gradoId || 9,
      materia_id: 1,
      periodo_id: periodo?.id || 'p-9-1',
      contenido: valoresLimpios,
      estado: 'PUBLICADO'
    };

    setApiPayload(payload);
    setGuardadoExitoso(true);

    if (alGuardar) {
      alGuardar(payload);
    }
  };

  return (
    <div className="bg-white border-2 border-negro shadow-retro p-1">
      {/* Barra de Título Retro */}
      <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center justify-between font-mono text-xs uppercase select-none">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-celeste" />
          <span>CONFIG_CUADRO_TEORICO.SYS</span>
        </div>
        
        {/* Pestañas de modo */}
        <div className="flex gap-1.5">
          <button
            onClick={() => { setModo('visualizar'); setGuardadoExitoso(false); }}
            className={`px-2 py-0.5 border text-[10px] font-bold cursor-pointer ${
              modo === 'visualizar'
                ? 'bg-celeste text-negro border-negro'
                : 'bg-azul-secundario text-white border-gray-400 hover:bg-azul-oscuro'
            }`}
          >
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> VER
            </span>
          </button>
          <button
            onClick={() => { setModo('editar'); setGuardadoExitoso(false); }}
            className={`px-2 py-0.5 border text-[10px] font-bold cursor-pointer ${
              modo === 'editar'
                ? 'bg-celeste text-negro border-negro'
                : 'bg-azul-secundario text-white border-gray-400 hover:bg-azul-oscuro'
            }`}
          >
            <span className="flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5" /> CONFIGURAR
            </span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-300">
        {/* MODO VISUALIZACIÓN */}
        {modo === 'visualizar' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-celeste/20 border border-celeste/60 p-2.5 text-xs text-azul-oscuro font-bold select-none">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-azul-secundario" />
                Matriz Curricular y E.B.C. del Periodo Académico
              </span>
              <span className="bg-white border border-negro px-2.5 py-0.5 font-mono flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-azul-secundario" />
                {valores.intensidad_horaria}
              </span>
            </div>

            {/* Fichas Estructuradas Multivalor */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
              {[
                { n: '1', t: 'Componente', d: valores.componente, sub: 'Matriz de Ref.' },
                { n: '2', t: 'Competencia', d: valores.competencia, sub: 'Matriz de Ref.' },
                { n: '3', t: 'Estándares Básicos', d: valores.estandares, sub: 'E.B.C.' },
                { n: '4', t: 'Aprendizaje', d: valores.aprendizaje, sub: 'Matriz de Ref.' },
                { n: '5', t: 'Evidencia', d: valores.evidencia, sub: 'Matriz de Ref.' }
              ].map((ficha) => (
                <div key={ficha.n} className="bg-white border-2 border-negro p-3.5 flex flex-col justify-between shadow-retro-sm">
                  <div>
                    <div className="flex justify-between items-start border-b border-gray-200 pb-1.5 mb-3 select-none">
                      <span className="bg-azul-oscuro text-white text-[10px] font-mono font-bold w-5 h-5 flex items-center justify-center border border-black">
                        {ficha.n}
                      </span>
                      <span className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider text-right">
                        {ficha.sub}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-azul-secundario uppercase select-none mb-2">
                      {ficha.t}
                    </h4>
                    
                    {Array.isArray(ficha.d) && ficha.d.length > 0 ? (
                      <ol className="list-decimal pl-4.5 text-xs text-gray-700 leading-relaxed font-semibold flex flex-col gap-2">
                        {ficha.d.map((item, idx) => (
                          <li key={idx} className="break-words pl-0.5">
                            {item}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <span className="text-gray-300 italic text-[11px] select-none block">No configurado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODO EDICIÓN */}
        {modo === 'editar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Formulario de Configuración Multivalor */}
            <form onSubmit={ejecutarGuardado} className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-white border border-gray-300 p-4 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-sm text-azul-oscuro uppercase mt-0 mb-1 select-none border-b pb-2">
                  Panel de Edición Curricular
                </h3>

                {/* Intensidad Horaria */}
                <div className="flex flex-col gap-1 border-b border-gray-200 pb-3">
                  <label className="text-xs font-mono font-bold text-gray-600 flex items-center gap-1 select-none">
                    <Clock className="w-3.5 h-3.5 text-azul-secundario" /> INTENSIDAD HORARIA GENERAL:
                  </label>
                  <input
                    type="text"
                    value={valores.intensidad_horaria}
                    onChange={manejarCambioIntensidad}
                    placeholder="Ej. 4 horas semanales"
                    required
                    className="w-full bg-white border-2 border-negro p-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-azul-secundario"
                  />
                </div>

                {/* Listados de Fila por Categoría */}
                {[
                  { k: 'componente', label: '1. COMPONENTE (Matriz de Ref.)' },
                  { k: 'competencia', label: '2. COMPETENCIA (Matriz de Ref.)' },
                  { k: 'estandares', label: '3. ESTÁNDARES BÁSICOS DE COMPETENCIAS (E.B.C.)' },
                  { k: 'aprendizaje', label: '4. APRENDIZAJE (Matriz de Ref.)' },
                  { k: 'evidencia', label: '5. EVIDENCIA (Matriz de Ref.)' }
                ].map((cat) => (
                  <div key={cat.k} className="flex flex-col gap-2 border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                    <label className="text-xs font-mono font-bold text-gray-700 select-none">
                      {cat.label}
                    </label>
                    
                    <div className="flex flex-col gap-2">
                      {valores[cat.k].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-gray-400 w-4 select-none">{idx + 1}.</span>
                          <textarea
                            value={item}
                            rows={1}
                            onChange={(e) => manejarCambioElemento(cat.k, idx, e.target.value)}
                            placeholder="Escribe el contenido de esta sección..."
                            required
                            className="flex-1 bg-white border-2 border-negro p-1.5 text-xs font-semibold outline-none focus:ring-1 resize-y"
                          />
                          <button
                            type="button"
                            onClick={() => eliminarElemento(cat.k, idx)}
                            className="bg-red-50 text-red-700 border-2 border-negro p-1.5 shadow-retro-sm active:translate-y-0.5 hover:bg-red-600 hover:text-white cursor-pointer shrink-0"
                            title="Eliminar este ítem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {valores[cat.k].length === 0 && (
                        <span className="text-xs text-gray-400 italic pl-5 select-none">Sin ítems agregados.</span>
                      )}

                      <div>
                        <button
                          type="button"
                          onClick={() => agregarElemento(cat.k)}
                          className="bg-white text-azul-secundario border-2 border-dashed border-azul-secundario px-3 py-1 text-[10px] font-bold hover:bg-blue-50 active:translate-y-0.5 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> AÑADIR REGISTRO
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setValores(parsearCuadroTeorico(periodo?.cuadroTeorico));
                    setGuardadoExitoso(false);
                  }}
                  className="bg-white border-2 border-negro px-4 py-2 text-xs font-mono font-bold shadow-retro hover:bg-gray-50 active:translate-y-0.5 cursor-pointer"
                >
                  RESTAURAR
                </button>
                <button
                  type="submit"
                  className="bg-celeste text-negro border-2 border-negro px-6 py-2 text-xs font-mono font-bold shadow-retro hover:bg-azul-secundario hover:text-white active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  GENERAR PAYLOAD
                </button>
              </div>
            </form>

            {/* Monitor de JSON para el desarrollador */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="bg-azul-oscuro text-celeste border-2 border-negro shadow-retro p-3 flex-1 flex flex-col font-mono text-[10px]">
                <div className="border-b border-gray-700 pb-2 mb-2 flex justify-between items-center text-white select-none">
                  <span className="flex items-center gap-1"><Code className="w-3.5 h-3.5" /> PAYLOAD_JSON.TXT</span>
                  <span className="text-[8px] bg-red-600 px-1 border border-black font-bold uppercase text-white animate-pulse">
                    MÚLTIPLES ELEMENTOS
                  </span>
                </div>
                <div className="flex-1 overflow-auto max-h-[400px]">
                  <pre className="text-white bg-slate-900 p-2.5 border border-gray-800 text-[9px] leading-normal select-text whitespace-pre-wrap">
                    {JSON.stringify({
                      grado_id: gradoId || 'ID_GRADO',
                      materia_id: 'ID_MATERIA',
                      periodo_id: periodo?.id || 'ID_PERIODO',
                      contenido: {
                        componente: valores.componente.filter(Boolean),
                        competencia: valores.competencia.filter(Boolean),
                        estandares: valores.estandares.filter(Boolean),
                        aprendizaje: valores.aprendizaje.filter(Boolean),
                        evidencia: valores.evidencia.filter(Boolean),
                        intensidad_horaria: valores.intensidad_horaria
                      },
                      estado: 'PUBLICADO'
                    }, null, 2)}
                  </pre>
                </div>
              </div>

              {guardadoExitoso && apiPayload && (
                <div className="bg-emerald-50 border-2 border-green-700 p-3 flex items-start gap-2.5 text-green-800 animate-fade-in shadow-retro-sm">
                  <Check className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold uppercase text-[11px] font-mono">Simulación de API Completa</h4>
                    <p className="text-[10px] mt-1 text-green-700 leading-normal">
                      Estructura JSON generada correctamente. Envía este payload usando POST/PUT a:
                      <code className="block bg-white text-green-800 px-1 py-0.5 border border-green-300 font-mono mt-1 text-[9px]">
                        POST {`\${VITE_API_URL}/cuadros-teoricos`}
                      </code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
