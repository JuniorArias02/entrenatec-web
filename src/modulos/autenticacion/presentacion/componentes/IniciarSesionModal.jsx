import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Key, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import usarAutenticacion from '../hooks/usarAutenticacion';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';

export default function IniciarSesionModal({ alCerrar }) {
  const navigate = useNavigate();
  const { iniciarSesion, cargando, error } = usarAutenticacion();
  
  const [modo, setModo] = useState('login'); // 'login' | 'registro'
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorLocal, setErrorLocal] = useState('');
  const [exitoLocal, setExitoLocal] = useState('');
  const [cargandoRegistro, setCargandoRegistro] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorLocal('');

    if (!correo.trim() || !contrasena.trim() || (modo === 'registro' && !nombre.trim())) {
      setErrorLocal('Por favor completa todos los campos requeridos.');
      return;
    }

    if (modo === 'registro') {
      setCargandoRegistro(true);
      try {
        const respuesta = await clienteHttp.post('/auth/registro', {
          nombre,
          correo,
          password: contrasena
        });

        if (respuesta.error) {
          setErrorLocal(respuesta.mensaje || 'Error al registrar usuario.');
        } else {
          setExitoLocal('Registro exitoso. Iniciando sesión...');
          // Autologin despues de registro exitoso
          await iniciarSesion(correo, contrasena);
          alCerrar();
          navigate('/inicio');
        }
      } catch (err) {
        setErrorLocal(err.message || 'Ocurrió un error inesperado al registrarse.');
      } finally {
        setCargandoRegistro(false);
      }
    } else {
      try {
        await iniciarSesion(correo, contrasena);
        alCerrar();
        navigate('/inicio');
      } catch (err) {
        // El error se gestiona en el hook
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-md bg-gris-claro border-2 border-negro shadow-retro p-1">
        {/* Barra superior de la ventana */}
        <div className="bg-azul-secundario text-white px-3 py-1.5 flex items-center justify-between font-bold text-xs uppercase select-none">
          <div className="flex items-center gap-2">
            {modo === 'login' ? <Key className="w-4 h-4 text-celeste animate-pulse" /> : <UserPlus className="w-4 h-4 text-celeste animate-pulse" />}
            <span className="font-mono tracking-wider">{modo === 'login' ? 'INICIAR_SESION.EXE' : 'CREAR_CUENTA.EXE'}</span>
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
            <div className="flex font-mono text-xs mb-4 select-none">
              <button 
                type="button"
                onClick={() => { setModo('login'); setErrorLocal(''); setExitoLocal(''); }}
                className={`flex-1 py-1.5 border-2 border-negro border-b-0 border-r-0 ${modo === 'login' ? 'bg-white font-bold' : 'bg-gray-200 text-gray-500 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]'}`}
              >
                INGRESAR
              </button>
              <button 
                type="button"
                onClick={() => { setModo('registro'); setErrorLocal(''); setExitoLocal(''); }}
                className={`flex-1 py-1.5 border-2 border-negro border-b-0 ${modo === 'registro' ? 'bg-white font-bold' : 'bg-gray-200 text-gray-500 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]'}`}
              >
                REGISTRARSE
              </button>
            </div>
            
            <h2 className="text-2xl font-extrabold uppercase text-azul-oscuro m-0 tracking-tight">
              {modo === 'login' ? 'Ingreso al Sistema' : 'Nuevo Estudiante'}
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-1">
              EntrenaTec OS v1.0.0
            </p>
          </div>

          {/* Alertas de error */}
          {(errorLocal || (modo === 'login' && error)) && (
            <div className="bg-red-50 border-2 border-red-600 p-3 text-red-700 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div className="text-xs font-bold font-mono">
                <span className="block uppercase text-red-600">Error del Sistema:</span>
                {errorLocal || error}
              </div>
            </div>
          )}

          {exitoLocal && (
            <div className="bg-green-50 border-2 border-green-600 p-3 text-green-700 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600 mt-0.5" />
              <div className="text-xs font-bold font-mono uppercase">
                {exitoLocal}
              </div>
            </div>
          )}

          {/* Campo: Nombre (Solo en Registro) */}
          {modo === 'registro' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-extrabold text-azul-oscuro font-mono flex justify-between">
                <span>Nombre Completo:</span>
                <span className="text-gray-400 font-normal">[Requerido]</span>
              </label>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={cargando || cargandoRegistro}
                placeholder="Ej. Juan Pérez"
                className="border-2 border-negro px-3 py-2 font-mono text-sm bg-white shadow-[inset_2px_2px_0px_0px_#cbd5e1] focus:outline-none disabled:bg-gray-100"
                required={modo === 'registro'}
                autoFocus
              />
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
              disabled={cargando || cargandoRegistro}
              placeholder="nombre@colegio.edu.co"
              className="border-2 border-negro px-3 py-2 font-mono text-sm bg-white shadow-[inset_2px_2px_0px_0px_#cbd5e1] focus:outline-none disabled:bg-gray-100"
              required
              autoFocus={modo === 'login'}
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
              disabled={cargando || cargandoRegistro}
              placeholder="••••••••••••"
              className="border-2 border-negro px-3 py-2 font-mono text-sm bg-white shadow-[inset_2px_2px_0px_0px_#cbd5e1] focus:outline-none disabled:bg-gray-100"
              required
            />
            {modo === 'registro' && (
              <p className="text-[10px] text-gray-500 font-mono italic">
                * Serás registrado como ESTUDIANTE del colegio.
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-200">
            <button 
              type="button"
              onClick={alCerrar}
              disabled={cargando || cargandoRegistro}
              className="bg-white text-negro border-2 border-negro px-4 py-2 font-bold text-xs uppercase shadow-retro-sm hover:bg-gris-claro active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={cargando || cargandoRegistro}
              className="bg-celeste text-negro border-2 border-negro px-5 py-2 font-bold text-xs uppercase shadow-retro-sm hover:bg-azul-secundario hover:text-white active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {(cargando || cargandoRegistro) ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Procesando...
                </>
              ) : (
                modo === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
