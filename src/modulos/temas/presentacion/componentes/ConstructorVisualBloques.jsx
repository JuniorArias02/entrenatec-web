import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, FileImage, Type, Heading, Video, UploadCloud, Heading2, Images, FileText, Link, Table, List, Code, Gamepad2, HelpCircle, Minus, Activity } from 'lucide-react';
import { Alerta } from '@/compartido/utilidades/Alerta';
import { obtenerUrlCompleta } from '@/compartido/utilidades/obtenerUrlCompleta';

export default function ConstructorVisualBloques({ bloquesIniciales = [], temaId, alGuardar, subirArchivo, subirGaleria, cargando }) {
  const [bloques, setBloques] = useState(bloquesIniciales);

  // Subcomponente de botón para la barra de herramientas
  const BotonHerramienta = ({ onClick, icono: Icono, texto, destaque }) => (
    <button 
      onClick={onClick} 
      className={`bg-white border-2 border-negro px-3 py-2 flex items-center justify-start gap-2.5 text-xs font-bold uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer w-full text-left ${destaque || 'text-negro hover:bg-gray-50'}`}
    >
      <Icono className="w-4 h-4 shrink-0" /> 
      <span className="flex-1 truncate">{texto}</span>
    </button>
  );

  const agregarBloque = (tipo) => {
    let metadataInicial = {};
    if (tipo === 'TITULO') metadataInicial = { nivel: 'h2', color: '#111827' };
    else if (tipo === 'CODIGO') metadataInicial = { lenguaje: 'javascript' };
    else if (tipo === 'LINK') metadataInicial = { texto: 'Haz clic aquí' };
    else if (tipo === 'LISTA') metadataInicial = { ordenada: false, elementos: ['Elemento 1', 'Elemento 2'] };
    else if (tipo === 'TABLA') metadataInicial = { cabeceras: ['Columna 1', 'Columna 2'], filas: [['Dato 1', 'Dato 2']] };

    const nuevoBloque = {
      tipo,
      contenido: '',
      metadata: metadataInicial,
      orden: bloques.length + 1,
      visible: true,
      _uiId: Date.now() // Solo para React Key temporal
    };
    setBloques([...bloques, nuevoBloque]);
  };

  const actualizarBloque = (index, campo, valor) => {
    setBloques(prev => {
      const nuevosBloques = [...prev];
      nuevosBloques[index] = { ...nuevosBloques[index], [campo]: valor };
      return nuevosBloques;
    });
  };

  const actualizarContenidoArchivo = (index, valor) => {
    setBloques(prev => {
      const nuevos = [...prev];
      nuevos[index] = { ...nuevos[index], contenido: valor };
      if (nuevos[index].metadata?.archivo_id) {
        const { archivo_id, url, ...restoMetadata } = nuevos[index].metadata;
        nuevos[index].metadata = restoMetadata;
      }
      return nuevos;
    });
  };

  const actualizarMetadata = (index, campo, valor) => {
    setBloques(prev => {
      const nuevosBloques = [...prev];
      nuevosBloques[index] = { ...nuevosBloques[index], metadata: { ...nuevosBloques[index].metadata, [campo]: valor } };
      return nuevosBloques;
    });
  };

  const eliminarBloque = (index) => {
    setBloques(bloques.filter((_, i) => i !== index));
  };

  const moverBloque = (index, direccion) => {
    if (direccion === -1 && index === 0) return;
    if (direccion === 1 && index === bloques.length - 1) return;
    
    const nuevosBloques = [...bloques];
    const temp = nuevosBloques[index];
    nuevosBloques[index] = nuevosBloques[index + direccion];
    nuevosBloques[index + direccion] = temp;
    
    // Reasignar el orden en base a la posición
    const bloquesReordenados = nuevosBloques.map((b, i) => ({ ...b, orden: i + 1 }));
    setBloques(bloquesReordenados);
  };

  const handleSubirArchivoParaBloque = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Previsualización instantánea
    const localUrl = URL.createObjectURL(file);
    actualizarBloque(index, 'contenido', localUrl);

    try {
      // Usar la función subirArchivo inyectada
      const resultado = await subirArchivo(file);
      // Guardar el ID de forma silenciosa, la previsualización local ya está activa
      actualizarMetadata(index, 'archivo_id', resultado.archivo_id);
    } catch (error) {
      Alerta.error('Error_Subida.exe', error.message);
      actualizarBloque(index, 'contenido', ''); // Revertir en caso de error
    }
  };

  const handleSubirGaleriaParaBloque = async (e, index) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const resultado = await subirGaleria(files);
      const urls = resultado.map(item => item.url);
      
      setBloques(prev => {
        const nuevos = [...prev];
        const bloque = nuevos[index];
        const metadataActual = bloque.metadata || {};
        const imagenesAnteriores = metadataActual.imagenes || [];
        
        nuevos[index] = { 
          ...bloque, 
          metadata: { 
            ...metadataActual, 
            imagenes: [...imagenesAnteriores, ...urls] 
          } 
        };
        return nuevos;
      });
      
    } catch (error) {
      Alerta.error('Error_Galeria.exe', error.message);
    }
  };

  const handleGuardar = () => {
    // Limpiar propiedades temporales del front como _uiId y vaciar contenido si es archivo
    const bloquesProcesados = bloques.map(({ _uiId, ...resto }) => {
      if (resto.metadata && resto.metadata.archivo_id) {
        return { ...resto, contenido: '' };
      }
      return resto;
    });
    alGuardar(bloquesProcesados);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      
      {/* Área Principal: Lista de Bloques (Izquierda) */}
      <div className="flex-1 flex flex-col gap-4 w-full">
        {bloques.length === 0 ? (
          <div className="border-2 border-dashed border-gray-400 p-12 text-center text-gray-500 font-mono text-sm">
            [ Espacio de trabajo vacío. Agrega bloques desde la barra superior. ]
          </div>
        ) : (
          bloques.map((bloque, index) => (
            <div key={bloque._uiId || index} className="bg-white border-2 border-negro flex flex-col group">
              {/* Cabecera del Bloque */}
              <div className="bg-azul-oscuro text-white px-2 py-1 flex items-center justify-between font-mono text-[10px] uppercase">
                <span className="font-bold flex items-center gap-2">
                  BLOQUE_{bloque.tipo} [ORDEN: {bloque.orden}]
                </span>
                <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moverBloque(index, -1)} className="hover:bg-gray-700 p-0.5" disabled={index === 0}>
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button onClick={() => moverBloque(index, 1)} className="hover:bg-gray-700 p-0.5" disabled={index === bloques.length - 1}>
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <div className="w-px h-3 bg-gray-500 mx-1"></div>
                  <button onClick={() => eliminarBloque(index)} className="hover:bg-red-500 p-0.5 text-red-200 hover:text-white">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Contenido del Bloque según Tipo */}
              <div className="p-4 bg-gray-50">
                {bloque.tipo === 'TITULO' && (
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text"
                      value={bloque.contenido}
                      onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                      placeholder="Escribe el título aquí..."
                      className="w-full border-2 border-black p-2 font-bold text-lg outline-none focus:border-azul-secundario bg-white"
                    />
                    <div className="flex items-center gap-3 mt-1">
                      <select 
                        value={bloque.metadata?.nivel || 'h2'}
                        onChange={(e) => actualizarMetadata(index, 'nivel', e.target.value)}
                        className="border border-black p-1 text-xs font-mono bg-white cursor-pointer"
                      >
                        <option value="h1">H1 Principal</option>
                        <option value="h2">H2 Secundario</option>
                        <option value="h3">H3 Terciario</option>
                      </select>
                    </div>
                  </div>
                )}

                {bloque.tipo === 'TEXTO' && (
                  <textarea 
                    value={bloque.contenido}
                    onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                    placeholder="Escribe tu párrafo aquí..."
                    rows="6"
                    className="w-full border-2 border-black p-3 outline-none focus:border-azul-secundario text-base bg-white resize-y shadow-inner"
                  />
                )}

                {bloque.tipo === 'SUBTITULO' && (
                  <input 
                    type="text"
                    value={bloque.contenido}
                    onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                    placeholder="Escribe el subtítulo aquí..."
                    className="w-full border-2 border-black p-2 font-bold text-md outline-none focus:border-azul-secundario bg-white"
                  />
                )}

                {bloque.tipo === 'VIDEO' && (
                  <div className="flex flex-col gap-2">
                    <input 
                      type="url"
                      value={bloque.contenido}
                      onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full border-2 border-black p-2 text-sm outline-none focus:border-azul-secundario bg-white"
                    />
                    <div className="text-xs font-mono text-gray-500">Pega la URL de YouTube o Vimeo.</div>
                  </div>
                )}

                {bloque.tipo === 'PDF' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <label className="bg-white border-2 border-black px-3 py-1.5 text-xs font-bold uppercase font-mono cursor-pointer hover:bg-gray-100 flex items-center gap-1 shadow-retro-sm">
                        <UploadCloud className="w-4 h-4" />
                        SUBIR PDF
                        <input 
                          type="file" 
                          accept="application/pdf"
                          onChange={(e) => handleSubirArchivoParaBloque(e, index)} 
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs font-mono text-gray-400 font-bold uppercase mx-2">O pegar URL:</span>
                      <input 
                        type="url"
                        value={bloque.contenido || bloque.metadata?.url || ''}
                        onChange={(e) => actualizarContenidoArchivo(index, e.target.value)}
                        placeholder="https://.../documento.pdf"
                        className="flex-1 border-2 border-black p-1.5 text-sm outline-none bg-white"
                      />
                    </div>
                    {(bloque.contenido || bloque.metadata?.url) && (
                      <div className="mt-2 text-xs font-mono text-green-600 bg-green-50 border border-green-200 p-2 break-all">
                        PDF Enlazado: {bloque.contenido || bloque.metadata?.url}
                      </div>
                    )}
                  </div>
                )}

                {bloque.tipo === 'LINK' && (
                  <div className="flex flex-col gap-2">
                    <input 
                      type="url"
                      value={bloque.contenido}
                      onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                      placeholder="https://..."
                      className="w-full border-2 border-black p-2 text-sm outline-none focus:border-azul-secundario bg-white"
                    />
                    <input 
                      type="text"
                      value={bloque.metadata?.texto || ''}
                      onChange={(e) => actualizarMetadata(index, 'texto', e.target.value)}
                      placeholder="Texto a mostrar (ej. Haz clic aquí)"
                      className="w-full border-2 border-black p-2 text-sm outline-none focus:border-azul-secundario bg-white mt-1"
                    />
                  </div>
                )}

                {bloque.tipo === 'IMAGEN' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <label className="bg-white border-2 border-black px-3 py-1.5 text-xs font-bold uppercase font-mono cursor-pointer hover:bg-gray-100 flex items-center gap-1 shadow-retro-sm">
                        <UploadCloud className="w-4 h-4" />
                        SUBIR DESDE PC
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleSubirArchivoParaBloque(e, index)} 
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs font-mono text-gray-400 font-bold uppercase mx-2">O pegar URL:</span>
                      <input 
                        type="url"
                        value={bloque.contenido || bloque.metadata?.url || ''}
                        onChange={(e) => actualizarContenidoArchivo(index, e.target.value)}
                        placeholder="https://..."
                        className="flex-1 border-2 border-black p-1.5 text-sm outline-none bg-white"
                      />
                    </div>
                    {(bloque.contenido || bloque.metadata?.url) && (
                      <div className="mt-4 border-2 border-dashed border-black p-2 bg-white flex justify-center overflow-hidden">
                        <img src={obtenerUrlCompleta(bloque.contenido || bloque.metadata?.url)} alt="Preview" className="max-h-64 w-auto object-contain" />
                      </div>
                    )}
                  </div>
                )}

                {bloque.tipo === 'GALERIA' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row gap-2">
                      <div className="flex-1">
                        <textarea 
                          value={bloque.contenido || ''}
                          onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                          placeholder="Ingresa un título o descripción para la galería..."
                          rows="2"
                          className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white resize-y"
                        />
                      </div>
                      <div className="shrink-0">
                        <label className="bg-white border-2 border-black px-3 py-2 text-xs font-bold uppercase font-mono cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-center gap-1 shadow-retro-sm h-full">
                          <UploadCloud className="w-5 h-5 text-azul-secundario" />
                          <span className="text-center">SUBIR<br/>IMÁGENES</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            multiple
                            onChange={(e) => handleSubirGaleriaParaBloque(e, index)} 
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    {bloque.metadata?.imagenes && bloque.metadata.imagenes.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 border-2 border-dashed border-gray-300 p-2 bg-gray-50 mt-2">
                        {bloque.metadata.imagenes.map((imgUrl, i) => (
                          <div key={i} className="aspect-square border border-black bg-white flex items-center justify-center overflow-hidden relative group">
                            <img src={obtenerUrlCompleta(imgUrl)} alt={`Previsualización ${i}`} className="w-full h-full object-cover" />
                            {/* Opcional: un botón para remover si quieren */}
                            <button 
                              onClick={() => {
                                const nuevasImg = [...bloque.metadata.imagenes];
                                nuevasImg.splice(i, 1);
                                actualizarMetadata(index, 'imagenes', nuevasImg);
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {bloque.tipo === 'LISTA' && (
                  <div className="flex flex-col gap-3">
                    <input 
                      type="text"
                      value={bloque.contenido || ''}
                      onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                      placeholder="Título de la lista (opcional)..."
                      className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white font-bold"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-mono font-bold">Tipo de lista:</label>
                      <select 
                        value={bloque.metadata?.ordenada ? 'true' : 'false'}
                        onChange={(e) => actualizarMetadata(index, 'ordenada', e.target.value === 'true')}
                        className="border-2 border-black p-1 text-xs font-mono bg-white cursor-pointer"
                      >
                        <option value="false">Desordenada (Viñetas)</option>
                        <option value="true">Ordenada (Números)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      {(bloque.metadata?.elementos || []).map((elemento, elIdx) => (
                        <div key={elIdx} className="flex gap-2 items-center">
                          <span className="font-mono text-xs w-6 text-center text-gray-500 font-bold">
                            {bloque.metadata?.ordenada ? `${elIdx + 1}.` : '★'}
                          </span>
                          <input 
                            type="text"
                            value={elemento}
                            onChange={(e) => {
                              const nuevosElementos = [...(bloque.metadata?.elementos || [])];
                              nuevosElementos[elIdx] = e.target.value;
                              actualizarMetadata(index, 'elementos', nuevosElementos);
                            }}
                            placeholder={`Elemento ${elIdx + 1}`}
                            className="flex-1 border-2 border-black p-1.5 outline-none focus:border-azul-secundario text-sm bg-white"
                          />
                          <button 
                            onClick={() => {
                              const nuevosElementos = [...(bloque.metadata?.elementos || [])];
                              nuevosElementos.splice(elIdx, 1);
                              actualizarMetadata(index, 'elementos', nuevosElementos);
                            }}
                            className="bg-red-50 text-red-600 border border-red-300 p-1.5 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        const nuevosElementos = [...(bloque.metadata?.elementos || []), ''];
                        actualizarMetadata(index, 'elementos', nuevosElementos);
                      }}
                      className="bg-gray-100 border-2 border-dashed border-gray-400 p-2 text-xs font-mono font-bold hover:bg-gray-200 text-gray-600"
                    >
                      + AGREGAR ELEMENTO
                    </button>
                  </div>
                )}

                {bloque.tipo === 'TABLA' && (
                  <div className="flex flex-col gap-3 overflow-x-auto">
                    <input 
                      type="text"
                      value={bloque.contenido || ''}
                      onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                      placeholder="Título de la tabla (opcional)..."
                      className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white font-bold"
                    />
                    
                    <div className="bg-white border-2 border-black p-2">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr>
                            {(bloque.metadata?.cabeceras || []).map((cabecera, cIdx) => (
                              <th key={cIdx} className="border border-black bg-celeste p-1 min-w-[120px]">
                                <div className="flex items-center gap-1">
                                  <input 
                                    type="text"
                                    value={cabecera}
                                    onChange={(e) => {
                                      const nuevasCabeceras = [...(bloque.metadata?.cabeceras || [])];
                                      nuevasCabeceras[cIdx] = e.target.value;
                                      actualizarMetadata(index, 'cabeceras', nuevasCabeceras);
                                    }}
                                    className="w-full bg-transparent outline-none font-bold text-xs uppercase"
                                    placeholder="COLUMNA"
                                  />
                                  <button 
                                    onClick={() => {
                                      const nuevasCabeceras = [...(bloque.metadata?.cabeceras || [])];
                                      nuevasCabeceras.splice(cIdx, 1);
                                      const nuevasFilas = (bloque.metadata?.filas || []).map(f => {
                                        const nf = [...f];
                                        nf.splice(cIdx, 1);
                                        return nf;
                                      });
                                      actualizarMetadata(index, 'cabeceras', nuevasCabeceras);
                                      actualizarMetadata(index, 'filas', nuevasFilas);
                                    }}
                                    className="text-red-600 hover:text-red-800 shrink-0"
                                    title="Eliminar columna"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </th>
                            ))}
                            <th className="border border-black p-1 w-10 text-center bg-gray-100">
                              <button 
                                onClick={() => {
                                  const nuevasCabeceras = [...(bloque.metadata?.cabeceras || []), `Col ${(bloque.metadata?.cabeceras?.length || 0) + 1}`];
                                  const nuevasFilas = (bloque.metadata?.filas || []).map(f => [...f, '']);
                                  actualizarMetadata(index, 'cabeceras', nuevasCabeceras);
                                  actualizarMetadata(index, 'filas', nuevasFilas);
                                }}
                                className="text-azul-secundario hover:text-azul-oscuro font-bold flex justify-center w-full"
                                title="Añadir columna"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(bloque.metadata?.filas || []).map((fila, fIdx) => (
                            <tr key={fIdx}>
                              {fila.map((celda, cIdx) => (
                                <td key={cIdx} className="border border-black p-1 bg-gray-50">
                                  <input 
                                    type="text"
                                    value={celda}
                                    onChange={(e) => {
                                      const nuevasFilas = [...(bloque.metadata?.filas || [])];
                                      const nuevaFila = [...nuevasFilas[fIdx]];
                                      nuevaFila[cIdx] = e.target.value;
                                      nuevasFilas[fIdx] = nuevaFila;
                                      actualizarMetadata(index, 'filas', nuevasFilas);
                                    }}
                                    className="w-full bg-transparent outline-none text-xs"
                                    placeholder="..."
                                  />
                                </td>
                              ))}
                              <td className="border border-black p-1 text-center bg-gray-100">
                                <button 
                                  onClick={() => {
                                    const nuevasFilas = [...(bloque.metadata?.filas || [])];
                                    nuevasFilas.splice(fIdx, 1);
                                    actualizarMetadata(index, 'filas', nuevasFilas);
                                  }}
                                  className="text-red-600 hover:text-red-800 flex justify-center w-full"
                                  title="Eliminar fila"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={(bloque.metadata?.cabeceras || []).length + 1} className="border border-black bg-gray-100 p-1 text-center">
                              <button 
                                onClick={() => {
                                  const longitudFila = (bloque.metadata?.cabeceras || []).length;
                                  const nuevaFila = Array(longitudFila).fill('');
                                  const nuevasFilas = [...(bloque.metadata?.filas || []), nuevaFila];
                                  actualizarMetadata(index, 'filas', nuevasFilas);
                                }}
                                className="w-full text-xs font-mono font-bold text-gray-600 hover:text-black py-1"
                              >
                                + AÑADIR FILA
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {bloque.tipo === 'CODIGO' && (
                  <div className="flex flex-col gap-2">
                    <select 
                      value={bloque.metadata?.lenguaje || 'javascript'}
                      onChange={(e) => actualizarMetadata(index, 'lenguaje', e.target.value)}
                      className="border-2 border-black p-1.5 text-xs font-mono bg-white cursor-pointer w-48"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="python">Python</option>
                      <option value="json">JSON</option>
                      <option value="text">Texto Plano</option>
                    </select>
                    <textarea 
                      value={bloque.contenido}
                      onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                      placeholder="// Escribe tu código aquí..."
                      rows="6"
                      className="w-full border-2 border-black p-3 outline-none focus:border-azul-secundario text-sm bg-gray-900 text-green-400 resize-y font-mono"
                    />
                  </div>
                )}

                {['ACTIVIDAD', 'QUIZ', 'MINIJUEGO'].includes(bloque.tipo) && (
                  <div className="flex flex-col gap-2">
                    <textarea 
                      value={bloque.contenido}
                      onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                      placeholder={`Datos o URL para el bloque de ${bloque.tipo}...`}
                      rows="3"
                      className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-yellow-50 resize-y font-mono"
                    />
                    <div className="text-xs font-mono text-gray-500">
                      Puedes ingresar la URL externa del recurso interactivo o configuración JSON.
                    </div>
                  </div>
                )}

                {bloque.tipo === 'SEPARADOR' && (
                  <div className="py-4 text-center border-2 border-dashed border-gray-300 font-mono text-xs text-gray-500 bg-gray-100">
                    [ Línea Divisoria / Separador Visual ]
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sidebar: Herramientas y Acciones (Derecha) */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-6 sticky top-6">
        
        {/* Catálogo de Herramientas */}
        <div className="bg-gray-100 border-2 border-negro shadow-retro p-4 select-none">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-negro pb-2">
            <Plus className="w-5 h-5 text-azul-oscuro" />
            <h2 className="font-extrabold font-mono text-sm uppercase text-azul-oscuro">Bloques</h2>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest">Tipografía</span>
              <div className="flex flex-col gap-2">
                <BotonHerramienta onClick={() => agregarBloque('TITULO')} icono={Heading} texto="Título" />
                <BotonHerramienta onClick={() => agregarBloque('SUBTITULO')} icono={Heading2} texto="Subtítulo" />
                <BotonHerramienta onClick={() => agregarBloque('TEXTO')} icono={Type} texto="Párrafo" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest">Multimedia</span>
              <div className="flex flex-col gap-2">
                <BotonHerramienta onClick={() => agregarBloque('IMAGEN')} icono={FileImage} texto="Imagen" />
                <BotonHerramienta onClick={() => agregarBloque('GALERIA')} icono={Images} texto="Galería" />
                <BotonHerramienta onClick={() => agregarBloque('VIDEO')} icono={Video} texto="Video" />
                <BotonHerramienta onClick={() => agregarBloque('PDF')} icono={FileText} texto="Doc PDF" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest">Estructura</span>
              <div className="flex flex-col gap-2">
                <BotonHerramienta onClick={() => agregarBloque('LISTA')} icono={List} texto="Lista" />
                <BotonHerramienta onClick={() => agregarBloque('TABLA')} icono={Table} texto="Tabla" />
                <BotonHerramienta onClick={() => agregarBloque('LINK')} icono={Link} texto="Enlace" />
                <BotonHerramienta onClick={() => agregarBloque('SEPARADOR')} icono={Minus} texto="Separador" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest">Interactivos</span>
              <div className="flex flex-col gap-2">
                <BotonHerramienta onClick={() => agregarBloque('CODIGO')} icono={Code} texto="Código" destaque="border-azul-secundario text-azul-secundario bg-blue-50" />
                <BotonHerramienta onClick={() => agregarBloque('ACTIVIDAD')} icono={Activity} texto="Actividad" destaque="border-green-600 text-green-700 bg-green-50" />
                <BotonHerramienta onClick={() => agregarBloque('QUIZ')} icono={HelpCircle} texto="Quiz" destaque="border-purple-600 text-purple-700 bg-purple-50" />
                <BotonHerramienta onClick={() => agregarBloque('MINIJUEGO')} icono={Gamepad2} texto="Minijuego" destaque="border-orange-500 text-orange-600 bg-orange-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Guardado */}
        <div className="bg-white border-2 border-negro shadow-retro p-4">
          <button 
            onClick={handleGuardar}
            disabled={cargando || bloques.length === 0}
            className={`w-full bg-celeste text-negro border-2 border-negro px-4 py-3 font-bold font-mono text-sm uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-azul-secundario hover:text-white active:translate-y-1 active:shadow-none transition-all flex justify-center items-center gap-2 cursor-pointer ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Save className="w-5 h-5" />
            {cargando ? 'Guardando...' : 'Guardar Tema'}
          </button>
        </div>
      </div>

    </div>
  );
}
