import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, FileImage, Type, Heading, Video, UploadCloud, Heading2, Images, FileText, Link, Table, List, Code, Gamepad2, HelpCircle, Minus, Activity } from 'lucide-react';
import { Alerta } from '@/compartido/utilidades/Alerta';

export default function ConstructorVisualBloques({ bloquesIniciales = [], temaId, alGuardar, subirArchivo, cargando }) {
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
    const nuevoBloque = {
      tipo,
      contenido: '',
      metadata: tipo === 'TITULO' ? { nivel: 'h2', color: '#111827' } : 
                tipo === 'CODIGO' ? { lenguaje: 'javascript' } : 
                tipo === 'LINK' ? { texto: 'Haz clic aquí' } : {},
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
                        <img src={bloque.contenido || bloque.metadata?.url} alt="Preview" className="max-h-64 w-auto object-contain" />
                      </div>
                    )}
                  </div>
                )}

                {bloque.tipo === 'GALERIA' && (
                  <div className="flex flex-col gap-2">
                    <textarea 
                      value={bloque.contenido}
                      onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                      placeholder="Ingresa una URL de imagen por línea..."
                      rows="4"
                      className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white resize-y"
                    />
                    <div className="text-xs font-mono text-gray-500">Agrega múltiples URLs separadas por saltos de línea.</div>
                  </div>
                )}

                {['LISTA', 'TABLA'].includes(bloque.tipo) && (
                  <div className="flex flex-col gap-2">
                    <textarea 
                      value={bloque.contenido}
                      onChange={(e) => actualizarBloque(index, 'contenido', e.target.value)}
                      placeholder={`Escribe el contenido de la ${bloque.tipo.toLowerCase()} aquí (puedes usar HTML o Markdown simple)...`}
                      rows="5"
                      className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-white resize-y font-mono"
                    />
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
