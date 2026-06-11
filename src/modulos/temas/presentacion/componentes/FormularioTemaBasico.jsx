import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function FormularioTemaBasico({ alEnviar, cargando, opciones = {} }) {
  const { grados = [], periodos = [], materias = [] } = opciones;

  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    descripcion: '',
    grado_id: grados[0]?.id || '',
    materia_id: materias[0]?.id || '',
    periodo_id: periodos[0]?.id || '',
    portada: null,
    orden: 1,
    estado: 'BORRADOR'
  });

  // Sincronizar primeros valores al cargar las opciones si formData está vacío
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      grado_id: prev.grado_id || (grados[0]?.id || ''),
      materia_id: prev.materia_id || (materias[0]?.id || ''),
      periodo_id: prev.periodo_id || (periodos[0]?.id || '')
    }));
  }, [grados, periodos, materias]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] || null }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['grado_id', 'materia_id', 'periodo_id', 'orden'].includes(name) ? Number(value) : value
      }));
    }
  };

  const handleGenerarSlug = () => {
    if (formData.titulo) {
      setFormData(prev => ({
        ...prev,
        slug: prev.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alEnviar(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Título */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-bold text-azul-oscuro uppercase text-xs">Título del Tema</label>
          <input 
            type="text" 
            name="titulo"
            required
            value={formData.titulo}
            onChange={handleChange}
            onBlur={handleGenerarSlug}
            className="border-2 border-negro px-3 py-2 outline-none focus:border-azul-secundario text-sm text-black"
            placeholder="Ej: Hardware y Software"
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-bold text-azul-oscuro uppercase text-xs">Identificador URL (Slug)</label>
          <input 
            type="text" 
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            className="border-2 border-negro px-3 py-2 bg-gray-50 outline-none focus:border-azul-secundario text-sm font-mono text-gray-600"
            placeholder="ej-hardware-y-software"
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-bold text-azul-oscuro uppercase text-xs">Descripción</label>
          <textarea 
            name="descripcion"
            required
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
            className="border-2 border-negro px-3 py-2 outline-none focus:border-azul-secundario text-sm resize-none text-black"
            placeholder="Breve resumen del tema..."
          ></textarea>
        </div>

        {/* Portada Archivo */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-bold text-azul-oscuro uppercase text-xs">Imagen de Portada (Opcional)</label>
          <input 
            type="file" 
            name="portada"
            accept="image/*"
            onChange={handleChange}
            className="border-2 border-negro px-3 py-2 outline-none focus:border-azul-secundario text-sm bg-white cursor-pointer text-black"
          />
        </div>

        {/* Grado */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-azul-oscuro uppercase text-xs">Grado</label>
          <select 
            name="grado_id"
            required
            value={formData.grado_id}
            onChange={handleChange}
            className="border-2 border-negro px-3 py-2 outline-none focus:border-azul-secundario text-sm cursor-pointer bg-white text-black"
          >
            <option value="" disabled>Seleccionar Grado...</option>
            {grados.map(g => (
              <option key={g.id} value={g.id}>{g.nombre}</option>
            ))}
          </select>
        </div>

        {/* Periodo */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-azul-oscuro uppercase text-xs">Periodo</label>
          <select 
            name="periodo_id"
            required
            value={formData.periodo_id}
            onChange={handleChange}
            className="border-2 border-negro px-3 py-2 outline-none focus:border-azul-secundario text-sm cursor-pointer bg-white text-black"
          >
            <option value="" disabled>Seleccionar Periodo...</option>
            {periodos.map(p => (
              <option key={p.id} value={p.id}>Periodo {p.numero}</option>
            ))}
          </select>
        </div>

        {/* Materia y Orden */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-azul-oscuro uppercase text-xs">Materia</label>
          <select 
            name="materia_id"
            required
            value={formData.materia_id}
            onChange={handleChange}
            className="border-2 border-negro px-3 py-2 outline-none focus:border-azul-secundario text-sm cursor-pointer bg-white text-black"
          >
            <option value="" disabled>Seleccionar Materia...</option>
            {materias.map(m => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-azul-oscuro uppercase text-xs">Orden Visual</label>
          <input 
            type="number" 
            name="orden"
            required
            min="1"
            value={formData.orden}
            onChange={handleChange}
            className="border-2 border-negro px-3 py-2 outline-none focus:border-azul-secundario text-sm font-mono text-black"
          />
        </div>

        {/* Estado */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-bold text-azul-oscuro uppercase text-xs">Estado Inicial</label>
          <select 
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="border-2 border-negro px-3 py-2 outline-none focus:border-azul-secundario text-sm cursor-pointer bg-white text-black"
          >
            <option value="BORRADOR">BORRADOR (Oculto a estudiantes)</option>
            <option value="PUBLICADO">PUBLICADO (Visible)</option>
          </select>
        </div>

      </div>

      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <button 
          type="submit"
          disabled={cargando}
          className={`bg-celeste text-negro border-2 border-negro px-6 py-2.5 font-bold font-mono text-sm uppercase shadow-retro-sm hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Save className="w-4 h-4" />
          {cargando ? 'PROCESANDO...' : 'CONTINUAR AL CONSTRUCTOR'}
        </button>
      </div>
    </form>
  );
}
