import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Play, Plus } from 'lucide-react';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';

export default function ListadoJuegosEstudiante() {
  const navigate = useNavigate();
  const { sesion } = usarAutenticacion();
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarJuegos = async () => {
      setCargando(true);
      try {
        const resultado = await clienteHttp.get('/sopa-letras');
        if (resultado.error) throw new Error(resultado.mensaje || 'Error al cargar los juegos');
        setJuegos(resultado.datos || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    };
    cargarJuegos();
  }, []);

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Cabecera */}
      <div className="bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1 flex items-center gap-2 font-mono text-xs uppercase">
          <Gamepad2 className="w-4 h-4 text-celeste" />
          <span>Centro_Juegos.exe</span>
        </div>
        <div className="p-5 bg-white border-b-2 border-negro flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0">
              Juegos Disponibles
            </h1>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              Aprende jugando. Selecciona un juego de la lista para poner a prueba tus habilidades.
            </p>
          </div>
          {['ADMIN', 'DOCENTE', 'EDITOR'].includes(sesion?.rol) && (
            <button 
              onClick={() => navigate('/juegos/sopa-letras/crear')}
              className="bg-green-600 text-white border-2 border-negro px-4 py-2 font-bold font-mono text-sm uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-green-500 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" /> Crear Sopa de Letras
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-negro p-4 font-mono text-xs text-red-800 shadow-retro">
          [X] ERROR DEL SISTEMA: {error}
        </div>
      )}

      {/* Lista de Juegos */}
      <div className="bg-white border-2 border-negro shadow-retro p-6 min-h-[400px]">
        {cargando ? (
          <div className="text-center font-mono text-sm py-12 text-gray-500">
            [ Buscando juegos en el servidor... ]
          </div>
        ) : juegos.length === 0 ? (
          <div className="text-center border-2 border-dashed border-gray-400 p-12 text-gray-500 font-mono text-sm">
            [ No hay juegos disponibles en este momento. ]
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {juegos.map(juego => (
              <div key={juego.id} className="border-2 border-negro bg-white shadow-retro-sm flex flex-col hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
                <div className="bg-gris-claro border-b-2 border-negro p-3 flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold uppercase text-azul-secundario">ID: {juego.id}</span>
                  <span className="font-mono text-[10px] font-bold uppercase border border-black px-1.5 py-0.5 bg-white">
                    {juego.puntaje_total} Pts
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-lg text-azul-oscuro uppercase mb-2 line-clamp-2">{juego.titulo}</h3>
                  <p className="text-xs text-gray-600 mb-4 line-clamp-3 flex-1">{juego.descripcion || 'Sin descripción'}</p>
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t-2 border-dashed border-gray-300">
                    <span className="font-mono text-xs font-bold text-gray-500">
                      {juego.tiempo_limite}s
                    </span>
                    <button 
                      onClick={() => navigate(`/juegos/sopa-letras/${juego.id}/jugar`)}
                      className="bg-yellow-400 text-negro border-2 border-negro px-4 py-2 font-bold font-mono text-[10px] uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Jugar
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
