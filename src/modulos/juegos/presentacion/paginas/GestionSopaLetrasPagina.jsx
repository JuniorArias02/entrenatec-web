import React, { useState, useEffect } from 'react';
import { Save, Gamepad2, Plus, Trash2 } from 'lucide-react';
import usarSopaLetras from '../hooks/usarSopaLetras';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';
import { Alerta } from '@/compartido/utilidades/Alerta';

export default function GestionSopaLetrasPagina() {
  const { crearSopaLetras, cargando } = usarSopaLetras();
  
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    tema_id: '',
    tiempo_limite: 120,
    puntaje_total: 100,
    estado: 'PUBLICADO',
    palabras: ['']
  });

  const [temas, setTemas] = useState([]);

  useEffect(() => {
    // Cargar temas para el select
    clienteHttp.get('/temas').then(res => {
      if (res.datos) setTemas(res.datos);
    }).catch(console.error);
  }, []);

  const actualizarPalabra = (index, valor) => {
    const nuevas = [...form.palabras];
    // Convertimos a mayúsculas porque las sopas de letras suelen ser en mayúsculas
    nuevas[index] = valor.toUpperCase().replace(/[^A-ZÑ]/g, ''); 
    setForm({ ...form, palabras: nuevas });
  };

  const agregarPalabra = () => {
    setForm({ ...form, palabras: [...form.palabras, ''] });
  };

  const eliminarPalabra = (index) => {
    const nuevas = form.palabras.filter((_, i) => i !== index);
    setForm({ ...form, palabras: nuevas });
  };

  const guardarJuego = async () => {
    // Limpiar palabras vacías
    const palabrasLimpio = form.palabras.filter(p => p.trim() !== '');
    if (palabrasLimpio.length < 2) {
      Alerta.error('Error', 'Debes incluir al menos 2 palabras válidas.');
      return;
    }

    try {
      const payload = {
        ...form,
        tema_id: form.tema_id ? parseInt(form.tema_id) : null,
        palabras: palabrasLimpio
      };
      await crearSopaLetras(payload);
      Alerta.exito('Juego Creado', 'Sopa de Letras guardada exitosamente.');
      // Reset form
      setForm({
        titulo: '', descripcion: '', tema_id: '', tiempo_limite: 120, puntaje_total: 100, estado: 'PUBLICADO', palabras: ['']
      });
    } catch (e) {
      Alerta.error('Error al Guardar', e.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in max-w-4xl mx-auto w-full">
      <div className="bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center gap-2 font-mono text-xs uppercase">
          <Gamepad2 className="w-4 h-4 text-celeste" />
          <span>Gestor_Juegos_SopaLetras.exe</span>
        </div>
        <div className="p-5 bg-white border-t border-gray-300">
          <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0">Creador de Sopa de Letras</h1>
          <p className="text-sm text-gray-600 mt-2 font-medium">Configura un juego interactivo donde los estudiantes busquen palabras en la cuadrícula.</p>
        </div>
      </div>

      <div className="bg-white border-2 border-negro shadow-retro p-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Título del Juego *</label>
              <input 
                type="text" 
                value={form.titulo}
                onChange={e => setForm({...form, titulo: e.target.value})}
                className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm"
                placeholder="Ej. Animales Vertebrados"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Descripción</label>
              <textarea 
                value={form.descripcion}
                onChange={e => setForm({...form, descripcion: e.target.value})}
                className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Tema Asociado (Opcional)</label>
              <select 
                value={form.tema_id}
                onChange={e => setForm({...form, tema_id: e.target.value})}
                className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm cursor-pointer"
              >
                <option value="">- Global / Sin Tema -</option>
                {temas.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Segundos</label>
                <input 
                  type="number" 
                  value={form.tiempo_limite}
                  onChange={e => setForm({...form, tiempo_limite: parseInt(e.target.value) || 0})}
                  className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Puntos Totales</label>
                <input 
                  type="number" 
                  value={form.puntaje_total}
                  onChange={e => setForm({...form, puntaje_total: parseInt(e.target.value) || 0})}
                  className="w-full border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold font-mono text-lg uppercase text-azul-oscuro">Lista de Palabras</h3>
              <button 
                onClick={agregarPalabra}
                className="bg-yellow-100 text-yellow-900 border-2 border-yellow-600 px-3 py-1 font-bold font-mono text-xs uppercase shadow-retro-sm hover:bg-yellow-500 hover:text-white active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Agregar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {form.palabras.map((palabra, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-gray-500">{index + 1}.</span>
                  <input 
                    type="text"
                    value={palabra}
                    onChange={e => actualizarPalabra(index, e.target.value)}
                    placeholder="PALABRA"
                    className="flex-1 border-2 border-black p-2 outline-none focus:border-azul-secundario text-sm font-bold tracking-widest uppercase"
                  />
                  <button 
                    onClick={() => eliminarPalabra(index)}
                    className="p-2 bg-red-50 text-red-600 border-2 border-red-300 hover:bg-red-500 hover:text-white cursor-pointer hover:border-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {form.palabras.length === 0 && (
              <div className="text-center p-6 text-gray-500 font-mono text-xs border-2 border-dashed border-gray-300">
                Añade palabras a la lista para configurar el juego.
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t-2 border-negro mt-4">
            <button 
              onClick={guardarJuego}
              disabled={cargando || !form.titulo || form.palabras.filter(p => p.trim() !== '').length < 2}
              className={`bg-green-600 text-white border-2 border-negro px-8 py-3 font-bold font-mono text-sm uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-green-500 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Save className="w-5 h-5" />
              {cargando ? 'Guardando...' : 'Crear y Publicar Juego'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
