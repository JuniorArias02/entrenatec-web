import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Monitor, Key, Terminal, HelpCircle } from 'lucide-react';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';
import IniciarSesionModal from '@/modulos/autenticacion/presentacion/componentes/IniciarSesionModal';
import AvisoBetaGlobal from '@/compartido/componentes/AvisoBetaGlobal';
import { NOMBRE_SISTEMA, VERSION_SISTEMA } from '@/compartido/constantes/version';

export default function PublicoLayout() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [hora, setHora] = useState('');
  const navigate = useNavigate();
  const { estaAutenticado } = usarAutenticacion();

  // Reloj digital retro
  useEffect(() => {
    const actualizarHora = () => {
      const ahora = new Date();
      const horas = String(ahora.getHours()).padStart(2, '0');
      const minutos = String(ahora.getMinutes()).padStart(2, '0');
      const segundos = String(ahora.getSeconds()).padStart(2, '0');
      setHora(`${horas}:${minutos}:${segundos}`);
    };
    actualizarHora();
    const interval = setInterval(actualizarHora, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gris-claro font-sans text-azul-oscuro relative">
      {/* Barra de navegación superior pública */}
      <header className="w-full flex flex-col border-b-4 border-negro bg-azul-oscuro text-white select-none z-40">
        <div className="flex items-center justify-between px-3 py-2 bg-azul-secundario border-b-2 border-negro">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-celeste animate-pulse" />
            <span className="font-bold tracking-widest text-sm uppercase">
              {NOMBRE_SISTEMA} - PORTAL DE APRENDIZAJE
            </span>
          </div>
          
          {/* Botón de inicio de sesión destacado en la esquina */}
          {estaAutenticado ? (
            <button 
              onClick={() => navigate('/inicio')}
              className="bg-celeste text-negro border-2 border-negro px-3 py-1 font-bold text-xs uppercase shadow-retro-sm hover:bg-white active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              Ingresar al Sistema
            </button>
          ) : (
            <button 
              onClick={() => navigate('/auth')}
              className="bg-celeste text-negro border-2 border-negro px-3 py-1 font-bold text-xs uppercase shadow-retro-sm hover:bg-white active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              Iniciar Sesión
            </button>
          )}
        </div>

        {/* Menú y estado simulados */}
        <div className="flex items-center justify-between p-2 bg-azul-oscuro">
          <div className="flex items-center gap-4 text-xs font-bold pl-1 uppercase text-gray-300">
            <Link to="/" className="hover:text-white hover:underline transition-all">Inicio</Link>
            <span className="text-gray-600">|</span>
            <a 
              href="#grados" 
              className="hover:text-white hover:underline transition-all"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('grados')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Grados 9, 10 y 11
            </a>
            <span className="text-gray-600">|</span>
            <a 
              href="#caracteristicas" 
              className="hover:text-white hover:underline transition-all"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('caracteristicas')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Características
            </a>
          </div>

          <div className="flex items-center gap-2 bg-gray-800 border border-gray-600 px-3 py-0.5 font-mono text-[10px] text-celeste shadow-[inset_1px_1px_0px_0px_#000000] rounded-sm">
            <Terminal className="w-3 h-3" />
            <span>{hora}</span>
          </div>
        </div>
      </header>

      {/* Contenido principal público */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-grid-patron flex flex-col z-10">
        <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-center">
          <Outlet context={{ abrirLogin: () => setMostrarLogin(true) }} />
        </div>
      </main>

      {/* Footer público */}
      <footer className="bg-azul-oscuro text-gray-400 text-center py-4 border-t-4 border-negro font-mono text-xs z-10">
        <p>© 2026 Proyecto EntrenaTec. Diseñado para potenciar el aprendizaje técnico escolar.</p>
        <p className="text-[10px] text-gray-600 mt-1">EntrenaTec OS v{VERSION_SISTEMA} - Grados 9º, 10º y 11º</p>
      </footer>

      {/* Modal de Inicio de Sesión */}
      {mostrarLogin && (
        <IniciarSesionModal alCerrar={() => setMostrarLogin(false)} />
      )}

      {/* Cuadro molesto de Beta */}
      <AvisoBetaGlobal />
    </div>
  );
}
