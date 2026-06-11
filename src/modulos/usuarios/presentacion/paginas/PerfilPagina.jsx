import React, { useState, useEffect } from 'react';
import usarUsuarios from '../hooks/usarUsuarios';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';
import { decodificarJwt } from '@/compartido/utilidades/jwt';

export default function PerfilPagina() {
  const { sesion } = usarAutenticacion();
  const { actualizarPerfil, cargando, usuarios, cargarUsuarios } = usarUsuarios();
  
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [usuarioId, setUsuarioId] = useState(null);
  
  const [mensajeExito, setMensajeExito] = useState('');
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (usuarios.length === 0) {
      cargarUsuarios().catch(() => {});
    }
  }, [cargarUsuarios, usuarios.length]);

  useEffect(() => {
    if (sesion?.token) {
      const payload = decodificarJwt(sesion.token);
      if (payload) {
        const id = payload.sub || payload.id;
        setUsuarioId(id);
        
        // Buscar en la lista global
        if (usuarios.length > 0) {
          const miUsuario = usuarios.find(u => String(u.id) === String(id));
          if (miUsuario) {
            setNombre(miUsuario.nombre);
            setCorreo(miUsuario.correo);
            return;
          }
        }
        
        // Fallback al payload
        if (payload.nombre) setNombre(payload.nombre);
        if (payload.correo) setCorreo(payload.correo);
      }
    }
  }, [sesion, usuarios]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensajeExito('');
    setErrores({});
    
    if (!usuarioId) {
      setErrores({ general: 'No se pudo identificar tu usuario en la sesión.' });
      return;
    }

    try {
      const payload = { nombre, correo };
      if (password.trim() !== '') {
        payload.password = password;
      }
      
      const respuesta = await actualizarPerfil(usuarioId, payload);
      setMensajeExito('Perfil actualizado con éxito.');
      // Actualizar los inputs con los datos de respuesta
      if (respuesta?.nombre) setNombre(respuesta.nombre);
      if (respuesta?.correo) setCorreo(respuesta.correo);
      setPassword(''); // Limpiar el campo de contraseña por seguridad
    } catch (error) {
      if (error.erroresValidacion) {
        setErrores(error.erroresValidacion);
      } else {
        setErrores({ general: error.message });
      }
    }
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-3xl mx-auto">
      {/* Ventana Retro */}
      <div className="bg-white border-2 border-negro shadow-retro mb-8">
        {/* Barra de título */}
        <div className="bg-azul-oscuro text-white p-3 flex justify-between items-center border-b-2 border-negro">
          <h2 className="font-bold text-lg uppercase flex items-center gap-2">
            <span className="text-celeste">_</span> CONFIGURACION_PERFIL.EXE
          </h2>
          <div className="flex gap-1">
            <div className="w-5 h-5 border-2 border-white cursor-pointer hover:bg-white hover:text-negro flex items-center justify-center font-bold text-xs">_</div>
            <div className="w-5 h-5 border-2 border-white cursor-pointer hover:bg-white hover:text-negro flex items-center justify-center font-bold text-xs">□</div>
            <div className="w-5 h-5 border-2 border-white cursor-pointer hover:bg-white hover:text-negro flex items-center justify-center font-bold text-xs">X</div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 md:p-8 bg-gris-claro">
          <h1 className="text-3xl md:text-4xl font-extrabold text-azul-secundario uppercase mb-6">
            Editar Perfil
          </h1>
          
          <p className="text-negro text-lg mb-8 max-w-2xl font-medium">
            Actualiza tu información personal en el sistema EntrenaTech. Los cambios se reflejarán de inmediato en tu perfil.
          </p>

          {mensajeExito && (
            <div className="bg-[#bbf7d0] border-2 border-negro text-[#166534] p-4 font-bold uppercase mb-6 shadow-retro-sm">
              [ ÉXITO ] {mensajeExito}
            </div>
          )}

          {errores.general && (
            <div className="bg-[#fecaca] border-2 border-negro text-[#991b1b] p-4 font-bold uppercase mb-6 shadow-retro-sm">
              [ ERROR ] {errores.general}
            </div>
          )}

          <form onSubmit={manejarEnvio} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre" className="font-bold uppercase text-negro flex items-center gap-2">
                <span className="text-azul-secundario text-xl">▶</span> Nombre Completo
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border-2 border-negro p-3 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-celeste focus:ring-opacity-50 transition-all bg-white"
                placeholder="Ej. Carlos Mendoza"
                required
              />
              {errores.nombre && (
                <p className="text-[#dc2626] font-bold text-sm uppercase">[{errores.nombre[0]}]</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="correo" className="font-bold uppercase text-negro flex items-center gap-2">
                <span className="text-azul-secundario text-xl">▶</span> Correo Electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full border-2 border-negro p-3 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-celeste focus:ring-opacity-50 transition-all bg-white"
                placeholder="Ej. carlos@demo.com"
                required
              />
              {errores.correo && (
                <p className="text-[#dc2626] font-bold text-sm uppercase">[{errores.correo[0]}]</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-bold uppercase text-negro flex items-center gap-2">
                <span className="text-azul-secundario text-xl">▶</span> Nueva Contraseña <span className="text-xs text-gray-500">(Opcional)</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-negro p-3 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-celeste focus:ring-opacity-50 transition-all bg-white"
                placeholder="Ej. MiNuevaContraseña123"
              />
              {errores.password && (
                <p className="text-[#dc2626] font-bold text-sm uppercase">[{errores.password[0]}]</p>
              )}
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={cargando}
                className="bg-celeste text-negro font-extrabold py-3 px-8 border-2 border-negro uppercase shadow-retro hover:-translate-y-1 hover:shadow-retro-lg transition-all active:translate-y-0 active:shadow-retro disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? 'ACTUALIZANDO...' : 'ACTUALIZAR PERFIL'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
