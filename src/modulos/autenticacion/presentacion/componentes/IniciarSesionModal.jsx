import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Key, Loader2 } from 'lucide-react';
import usarAutenticacion from '../hooks/usarAutenticacion';

export default function IniciarSesionModal({ alCerrar }) {
  const navigate = useNavigate();
  const { iniciarSesion, cargando, error } = usarAutenticacion();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorLocal, setErrorLocal] = useState('');

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorLocal('');

    if (!correo.trim() || !contrasena.trim()) {
      setErrorLocal('Por favor completa todos los campos.');
      return;
    }

    try {
      await iniciarSesion(correo, contrasena);
      alCerrar();
      navigate('/inicio');
    } catch (err) {
      // El error se gestiona en el hook, pero por si acaso, lo atrapamos
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-md bg-gris-claro border-2 border-negro shadow-retro p-1">
        {/* Barra superior de la ventana */}
        <div className="bg-azul-secundario text-white px-3 py-1.5 flex items-center justify-between font-bold text-xs uppercase select-none">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-celeste animate-pulse" />
            <span className="font-mono tracking-wider">INICIAR_SESION.EXE</span>
          </div>
          <button 
            onClick={alCerrar}
            className="w-5 h-5 bg-gris-claro text-negro border border-white border-r-gray-500 border-b-gray-500 flex items-center justify-center font-bold font-mono text-[9px] hover:bg-red-500 hover:text-white transition-colors shadow-retro-sm cursor-pointer"
          >
            X
          </button>
        </div>

        {/* Formulario/Cuerpo de la ventana */}
        <form onSubmit={manejarEnvio} className="p-6 bg-white border border-t-0 border-gray-300 flex flex-col gap-4">
          <div className="text-center pb-2 border-b border-gray-200">
            <h2 className="text-2xl font-extrabold uppercase text-azul-oscuro m-0 tracking-tight">
              Ingreso al Sistema
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-1">
              EntrenaTec OS v1.0.0
            </p>
          </div>

          {/* Alertas de error */}
          {(errorLocal || error) && (
            <div className="bg-red-50 border-2 border-red-600 p-3 text-red-700 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div className="text-xs font-bold font-mono">
                <span className="block uppercase text-red-600">Error del Sistema:</span>
                {errorLocal || error}
              </div>
            </div>
          )}

          {/* Campo: Correo */}
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-extrabold text-azul-oscuro font-mono flex justify-between">
              <span>Correo Electrónico:</span>
              <span className="text-gray-400 font-normal">[Requerido]</span>
            </label>
            <input 
              type="email" 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={cargando}
              placeholder="nombre@colegio.edu.co"
              className="border-2 border-negro px-3 py-2 font-mono text-sm bg-white shadow-[inset_2px_2px_0px_0px_#cbd5e1] focus:outline-hidden disabled:bg-gray-100"
              required
              autoFocus
            />
          </div>

          {/* Campo: Contraseña */}
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-extrabold text-azul-oscuro font-mono flex justify-between">
              <span>Contraseña de Acceso:</span>
              <span className="text-gray-400 font-normal">[Requerido]</span>
            </label>
            <input 
              type="password" 
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              disabled={cargando}
              placeholder="••••••••••••"
              className="border-2 border-negro px-3 py-2 font-mono text-sm bg-white shadow-[inset_2px_2px_0px_0px_#cbd5e1] focus:outline-hidden disabled:bg-gray-100"
              required
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-200">
            <button 
              type="button"
              onClick={alCerrar}
              disabled={cargando}
              className="bg-white text-negro border-2 border-negro px-4 py-2 font-bold text-xs uppercase shadow-retro-sm hover:bg-gris-claro active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={cargando}
              className="bg-celeste text-negro border-2 border-negro px-5 py-2 font-bold text-xs uppercase shadow-retro-sm hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {cargando ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Aceptar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
