import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usarConstructorTema from '../hooks/usarConstructorTema';
import usarContenidoPeriodo from '../../../periodos/presentacion/hooks/usarContenidoPeriodo';
import FormularioTemaBasico from '../componentes/FormularioTemaBasico';
import ConstructorVisualBloques from '../componentes/ConstructorVisualBloques';
import GestorCuadroTeorico from '../../../periodos/presentacion/componentes/GestorCuadroTeorico';
import { ArrowLeft, Edit3, Settings, BookOpen, Layers } from 'lucide-react';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';
import { Alerta } from '@/compartido/utilidades/Alerta';

export default function CrearTemaPagina() {
  const navigate = useNavigate();
  const {
    paso,
    setPaso,
    temas,
    temaBase,
    cargando,
    error,
    cargarTemas,
    cargarTemaParaEditar,
    iniciarNuevoTema,
    crearTema,
    guardarBloques,
    subirArchivo,
    bloques,
    opciones,
    cargarOpciones,
    cambiarEstadoTema
  } = usarConstructorTema();

  const { contenido, obtenerContenido, cargando: cargandoCT } = usarContenidoPeriodo();

  const [modalCTVisible, setModalCTVisible] = useState(false);
  const [ctGradoId, setCtGradoId] = useState('');
  const [ctPeriodoId, setCtPeriodoId] = useState('');
  
  // Novedades para listar los cuadros teoricos
  const [vistaCT, setVistaCT] = useState('lista'); // 'lista', 'nuevo', 'editar'
  const [listaCT, setListaCT] = useState([]);
  const [cargandoListaCT, setCargandoListaCT] = useState(false);
  const [ctSeleccionado, setCtSeleccionado] = useState(null);

  const cargarCuadrosTeoricos = async () => {
    setCargandoListaCT(true);
    try {
      const data = await clienteHttp.get('/cuadros-teoricos');
      if (!data.error && data.datos) {
        setListaCT(data.datos);
      }
    } catch (error) {
      console.error("Error cargando cuadros teoricos", error);
    } finally {
      setCargandoListaCT(false);
    }
  };

  useEffect(() => {
    if (modalCTVisible && vistaCT === 'lista') {
      cargarCuadrosTeoricos();
    }
  }, [modalCTVisible, vistaCT]);

  useEffect(() => {
    // Si estamos en modo nuevo y se elige grado y periodo, obtener su contenido
    if (vistaCT === 'nuevo' && ctGradoId && ctPeriodoId) {
      obtenerContenido(ctGradoId, ctPeriodoId);
    }
  }, [ctGradoId, ctPeriodoId, vistaCT, obtenerContenido]);

  const handleCambiarEstado = async (temaId, estadoActual) => {
    const nuevoEstado = estadoActual === 'PUBLICADO' ? 'BORRADOR' : 'PUBLICADO';
    try {
      await cambiarEstadoTema(temaId, nuevoEstado);
    } catch (e) {
      console.error('Error al cambiar de estado', e);
    }
  };

  useEffect(() => {
    cargarOpciones();
    cargarTemas();
  }, [cargarOpciones, cargarTemas]);

  const handleCrearBase = async (datosBase) => {
    try {
      await crearTema(datosBase);
    } catch (e) {
      console.error('Fallo al crear tema base', e);
    }
  };

  const handleGuardarBloques = async (nuevosBloques) => {
    if (!temaBase?.id) return;
    try {
      await guardarBloques(temaBase.id, nuevosBloques);
      Alerta.exito('Guardado_Exitoso.exe', 'Contenido sincronizado correctamente. El tema ya tiene bloques asociados.');
      cargarTemas(); // Refrescar el listado general en background
    } catch (e) {
      console.error('Fallo al sincronizar bloques', e);
    }
  };

  const handleVolver = () => {
    if (paso === 0) {
      navigate(-1);
    } else {
      setPaso(0);
      cargarTemas(); // Recargar listado al volver
    }
  };

  // Definir título y descripción de la cabecera según el paso
  const obtenerDetallesCabecera = () => {
    switch (paso) {
      case 1:
        return {
          titulo: 'Crear Nuevo Tema',
          desc: 'Paso 1: Define los metadatos y la configuración de grado y periodo para el nuevo tema.'
        };
      case 2:
        return {
          titulo: `Constructor Visual: ${temaBase?.titulo || ''}`,
          desc: 'Paso 2: Diseña, arrastra, ordena y publica bloques interactivos de contenido.'
        };
      case 0:
      default:
        return {
          titulo: 'Gestor del Plan Curricular (CMS)',
          desc: 'Panel del Docente: Crea temas nuevos o edita borradores existentes para agregar bloques interactivos.'
        };
    }
  };

  const cabecera = obtenerDetallesCabecera();

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Botón de Retorno */}
      <div>
        <button 
          onClick={handleVolver}
          className="bg-white text-negro border-2 border-negro px-3 py-1.5 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-gray-100 active:translate-y-0.5 active:shadow-none inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {paso === 0 ? 'Volver' : 'Volver al Listado'}
        </button>
      </div>

      {/* Cabecera del Creador */}
      <div className="bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1 flex items-center gap-2 font-mono text-xs uppercase">
          <Edit3 className="w-4 h-4 text-celeste" />
          <span>Editor_Temas.exe</span>
        </div>
        <div className="p-5 bg-white border-b-2 border-negro">
          <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0">
            {cabecera.titulo}
          </h1>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            {cabecera.desc}
          </p>
        </div>
        
        {/* Indicador de Pasos - Solo visible en creación o edición */}
        {paso > 0 && (
          <div className="bg-gray-50 p-3 flex items-center gap-4 font-mono text-xs font-bold uppercase border-t border-gray-200">
            <div className={`flex items-center gap-2 ${paso === 1 ? 'text-azul-secundario' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 border-2 flex items-center justify-center ${paso === 1 ? 'border-azul-secundario bg-blue-50' : 'border-gray-400'}`}>
                1
              </div>
              <span>Datos Básicos</span>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
            <div className={`flex items-center gap-2 ${paso === 2 ? 'text-azul-secundario' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 border-2 flex items-center justify-center ${paso === 2 ? 'border-azul-secundario bg-blue-50' : 'border-gray-400'}`}>
                2
              </div>
              <span>Contenido</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-negro p-4 font-mono text-xs text-red-800 shadow-retro">
          [X] ERROR DEL SISTEMA: {error}
        </div>
      )}

      {/* Área de Trabajo */}
      <div className="bg-white border-2 border-negro shadow-retro p-6 min-h-[400px]">
        {paso === 0 ? (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b-2 border-negro pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-azul-secundario" />
                <h2 className="text-xl font-bold font-mono text-azul-oscuro uppercase">Mis Temas y Borradores</h2>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <button 
                  onClick={() => setModalCTVisible(true)}
                  className="bg-yellow-100 text-yellow-900 border-2 border-yellow-600 px-4 py-2 font-bold font-mono text-xs uppercase shadow-retro hover:bg-yellow-500 hover:text-white active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" /> Configurar Plan Teórico
                </button>
                <button 
                  onClick={iniciarNuevoTema}
                  className="bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold font-mono text-xs uppercase shadow-retro hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none cursor-pointer"
                >
                  + Crear Nuevo Tema
                </button>
              </div>
            </div>

            {cargando && temas.length === 0 ? (
              <div className="text-center font-mono text-sm py-12">
                [ Cargando temas del CMS... ]
              </div>
            ) : temas.length === 0 ? (
              <div className="text-center border-2 border-dashed border-gray-300 p-12 text-gray-500 font-mono text-sm">
                [ No hay temas registrados en el sistema. Presiona "Crear Nuevo Tema" para registrar el primero. ]
              </div>
            ) : (
              <div className="overflow-x-auto border-2 border-negro">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-azul-oscuro text-white border-b-2 border-negro uppercase">
                      <th className="p-3 border-r border-negro">Título</th>
                      <th className="p-3 border-r border-negro">Grado / Periodo</th>
                      <th className="p-3 border-r border-negro">Estado</th>
                      <th className="p-3 border-r border-negro text-center">Bloques</th>
                      <th className="p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-negro">
                    {temas.map((tema) => {
                      const gradoName = opciones.grados.find(g => g.id === tema.grado_id)?.nombre || `Grado ${tema.grado_id}`;
                      const periodoName = opciones.periodos.find(p => p.id === tema.periodo_id)?.nombre || `P${tema.periodo_id}`;
                      
                      const estadoEstilo = 
                        tema.estado === 'PUBLICADO' ? 'bg-green-100 text-green-800 border-green-600' :
                        tema.estado === 'OCULTO' ? 'bg-yellow-100 text-yellow-800 border-yellow-500' :
                        'bg-gray-100 text-gray-800 border-gray-500';

                      const tieneContenido = tema.tiene_contenido || (tema.bloques_count > 0);

                      return (
                        <tr key={tema.id} className="hover:bg-gray-50">
                          <td className="p-3 border-r border-negro font-bold text-azul-oscuro">{tema.titulo}</td>
                          <td className="p-3 border-r border-negro">{gradoName} - {periodoName}</td>
                          <td className="p-3 border-r border-negro">
                            <span className={`px-2 py-0.5 border font-bold rounded-sm uppercase text-[10px] ${estadoEstilo}`}>
                              {tema.estado || 'BORRADOR'}
                            </span>
                          </td>
                          <td className="p-3 border-r border-negro text-center font-bold">
                            {tema.bloques_count ?? 0}
                          </td>
                          <td className="p-3 flex items-center justify-center gap-2">
                            <button
                              onClick={() => cargarTemaParaEditar(tema.id)}
                              className={`px-3 py-1.5 border-2 border-negro font-bold uppercase shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:bg-azul-secundario hover:text-white active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                                tieneContenido
                                  ? 'bg-celeste text-negro'
                                  : 'bg-white text-azul-oscuro'
                              }`}
                            >
                              {tieneContenido ? 'Editar Contenido' : 'Crear Contenido'}
                            </button>
                            <button
                              onClick={() => handleCambiarEstado(tema.id, tema.estado)}
                              disabled={cargando}
                              className={`px-3 py-1.5 border-2 border-negro font-bold uppercase shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                                tema.estado === 'PUBLICADO'
                                  ? 'bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border-red-800'
                                  : 'bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border-green-800'
                              }`}
                            >
                              {tema.estado === 'PUBLICADO' ? 'Despublicar' : 'Publicar'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : paso === 1 ? (
          <FormularioTemaBasico 
            alEnviar={handleCrearBase} 
            cargando={cargando} 
            opciones={opciones}
            // Pasar temaBase para edición si existe
            temaBase={temaBase}
          />
        ) : (
          <ConstructorVisualBloques 
            bloquesIniciales={bloques}
            temaId={temaBase?.id}
            alGuardar={handleGuardarBloques}
            subirArchivo={subirArchivo}
            cargando={cargando}
          />
        )}
      </div>

      {/* Modal para Gestor de Cuadro Teórico */}
      {modalCTVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border-2 border-negro shadow-retro w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="bg-azul-oscuro text-white px-3 py-2 flex items-center justify-between font-mono text-xs uppercase border-b-2 border-negro">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-celeste" />
                <span>Gestor Central de Planes Teóricos</span>
              </div>
              <button 
                onClick={() => {
                  setModalCTVisible(false);
                  setVistaCT('lista');
                }} 
                className="bg-red-500 text-white px-2 py-0.5 border border-black hover:bg-red-600 cursor-pointer font-bold"
              >
                X
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 flex flex-col gap-4 flex-1 overflow-y-auto">
              {vistaCT === 'lista' ? (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center bg-white border-2 border-negro p-3 shadow-retro-sm">
                    <span className="font-mono text-xs font-bold uppercase text-azul-oscuro">
                      Listado de Planes Teóricos Registrados
                    </span>
                    <button 
                      onClick={() => {
                        setCtSeleccionado(null);
                        setCtGradoId('');
                        setCtPeriodoId('');
                        setVistaCT('nuevo');
                      }}
                      className="bg-celeste text-negro border-2 border-negro px-3 py-1.5 font-bold font-mono text-xs uppercase shadow-retro hover:bg-azul-secundario hover:text-white active:translate-y-0.5 cursor-pointer"
                    >
                      + Crear Nuevo Plan
                    </button>
                  </div>

                  {cargandoListaCT ? (
                    <div className="text-center font-mono text-xs py-10 bg-white border-2 border-negro">
                      [ Cargando listado de la base de datos... ]
                    </div>
                  ) : listaCT.length === 0 ? (
                    <div className="text-center font-mono text-xs py-10 text-gray-500 bg-white border-2 border-dashed border-gray-300">
                      No hay cuadros teóricos registrados. Haz clic en "+ Crear Nuevo Plan" para empezar.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border-2 border-negro bg-white shadow-retro-sm">
                      <table className="w-full text-left border-collapse font-mono text-xs">
                        <thead>
                          <tr className="bg-azul-oscuro text-white border-b-2 border-negro uppercase">
                            <th className="p-3 border-r border-negro">Grado</th>
                            <th className="p-3 border-r border-negro">Materia</th>
                            <th className="p-3 border-r border-negro">Periodo</th>
                            <th className="p-3 border-r border-negro">Estado</th>
                            <th className="p-3 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-negro">
                          {listaCT.map((ct) => (
                            <tr key={ct.id} className="hover:bg-gray-50">
                              <td className="p-3 border-r border-negro font-bold text-azul-oscuro">
                                {ct.grado?.nombre || `Grado ${ct.grado_id}`}
                              </td>
                              <td className="p-3 border-r border-negro">
                                {ct.materia?.nombre || `Materia ${ct.materia_id}`}
                              </td>
                              <td className="p-3 border-r border-negro font-bold text-azul-secundario">
                                {ct.periodo?.nombre || `Periodo ${ct.periodo_id}`}
                              </td>
                              <td className="p-3 border-r border-negro">
                                <span className={`px-2 py-0.5 border font-bold rounded-sm uppercase text-[10px] ${ct.estado === 'PUBLICADO' ? 'bg-green-100 text-green-800 border-green-600' : 'bg-yellow-100 text-yellow-800 border-yellow-500'}`}>
                                  {ct.estado || 'PUBLICADO'}
                                </span>
                              </td>
                              <td className="p-3 flex justify-center">
                                <button
                                  onClick={() => {
                                    setCtSeleccionado(ct);
                                    setCtGradoId(ct.grado_id);
                                    setCtPeriodoId(ct.periodo_id);
                                    setVistaCT('editar');
                                  }}
                                  className="bg-white text-azul-oscuro border-2 border-negro px-3 py-1 font-bold shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:bg-azul-secundario hover:text-white active:translate-y-[1px] cursor-pointer uppercase text-[10px]"
                                >
                                  Ver / Editar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="bg-white border-2 border-negro p-3 shadow-retro-sm flex flex-col md:flex-row gap-4 items-end">
                    <div className="shrink-0">
                      <button 
                        onClick={() => setVistaCT('lista')}
                        className="bg-gray-100 border-2 border-negro px-3 py-1.5 font-bold font-mono text-xs shadow-retro-sm hover:bg-gray-200 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5 uppercase"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Volver al Listado
                      </button>
                    </div>

                    <div className="flex-1 flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-mono font-bold text-gray-700 mb-1">1. Grado</label>
                        <select 
                          value={ctGradoId} 
                          onChange={e => setCtGradoId(e.target.value)}
                          disabled={ctSeleccionado !== null}
                          className="w-full bg-white border-2 border-negro p-2 text-xs font-semibold outline-none disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="">-- Elige un Grado --</option>
                          {opciones.grados.map(g => (
                            <option key={g.id} value={g.id}>{g.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-mono font-bold text-gray-700 mb-1">2. Periodo</label>
                        <select 
                          value={ctPeriodoId} 
                          onChange={e => setCtPeriodoId(e.target.value)}
                          disabled={ctSeleccionado !== null || !ctGradoId}
                          className="w-full bg-white border-2 border-negro p-2 text-xs font-semibold outline-none disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="">-- Elige un Periodo --</option>
                          {opciones.periodos.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {ctSeleccionado ? (
                    <GestorCuadroTeorico 
                      gradoId={ctSeleccionado.grado_id}
                      periodo={{ 
                        id: ctSeleccionado.periodo_id, 
                        cuadroTeorico: ctSeleccionado.contenido 
                      }} 
                      alGuardar={async (payloadGestor) => {
                        try {
                          const payloadFinal = {
                            ...payloadGestor,
                            grado_id: parseInt(ctSeleccionado.grado_id, 10),
                            materia_id: parseInt(ctSeleccionado.materia_id || 1, 10),
                            periodo_id: parseInt(ctSeleccionado.periodo_id, 10)
                          };
                          const data = await clienteHttp.put(`/cuadros-teoricos/${ctSeleccionado.id}`, payloadFinal);
                          if (!data.error) {
                            Alerta.exito('Guardado_Exitoso.exe', 'Cuadro Teórico actualizado correctamente.');
                            cargarCuadrosTeoricos();
                            setVistaCT('lista');
                          }
                        } catch (error) {
                          Alerta.error('Error', 'No se pudo actualizar el cuadro teórico.');
                        }
                      }}
                    />
                  ) : (
                    <>
                      {cargandoCT ? (
                        <div className="text-center font-mono text-xs py-10 bg-white border-2 border-negro">
                          [ Cargando datos base del servidor... ]
                        </div>
                      ) : ctGradoId && ctPeriodoId ? (
                        <GestorCuadroTeorico 
                          gradoId={ctGradoId}
                          periodo={{ 
                            id: ctPeriodoId, 
                            cuadroTeorico: contenido?.cuadro_teorico?.contenido 
                          }} 
                          alGuardar={async (payloadGestor) => {
                            try {
                              const payloadFinal = {
                                ...payloadGestor,
                                grado_id: parseInt(ctGradoId, 10),
                                materia_id: 1, // Por defecto o puede ser dinámico
                                periodo_id: parseInt(ctPeriodoId, 10)
                              };
                              const data = await clienteHttp.post('/cuadros-teoricos', payloadFinal);
                              if (!data.error) {
                                Alerta.exito('Guardado_Exitoso.exe', 'Cuadro Teórico creado correctamente.');
                                cargarCuadrosTeoricos();
                                setVistaCT('lista');
                              }
                            } catch (error) {
                              Alerta.error('Error', 'No se pudo crear el cuadro teórico.');
                            }
                          }}
                        />
                      ) : (
                        <div className="text-center font-mono text-xs py-10 text-gray-500 bg-white border-2 border-dashed border-gray-300">
                          Selecciona el Grado y el Periodo para crear o configurar su Cuadro Teórico Pedagógico.
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
