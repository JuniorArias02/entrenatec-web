import React, { useEffect, useState } from 'react';
import usarUsuarios from '../hooks/usarUsuarios';
import { Users, UserPlus, Key, Shield, AlertTriangle } from 'lucide-react';
import { Alerta } from '@/compartido/utilidades/Alerta';

export default function GestionUsuariosPagina() {
  const {
    usuarios,
    cargando,
    error,
    cargarUsuarios,
    crearUsuario,
    cambiarPassword,
    cambiarRol
  } = usarUsuarios();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState(''); // 'CREAR', 'PASSWORD', 'ROL'
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Formularios
  const [formDataCrear, setFormDataCrear] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'ESTUDIANTE',
    estado: 'ACTIVO'
  });
  const [formDataPassword, setFormDataPassword] = useState({ password: '' });
  const [formDataRol, setFormDataRol] = useState({ rol: 'ESTUDIANTE' });

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const abrirModalCrear = () => {
    setModalTipo('CREAR');
    setFormDataCrear({ nombre: '', correo: '', password: '', rol: 'ESTUDIANTE', estado: 'ACTIVO' });
    setModalVisible(true);
  };

  const abrirModalPassword = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalTipo('PASSWORD');
    setFormDataPassword({ password: '' });
    setModalVisible(true);
  };

  const abrirModalRol = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalTipo('ROL');
    setFormDataRol({ rol: usuario.rol });
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setUsuarioSeleccionado(null);
  };

  const manejarSubmitCrear = async (e) => {
    e.preventDefault();
    try {
      await crearUsuario(formDataCrear);
      cerrarModal();
    } catch (error) {
      Alerta.error('Error_Creacion.exe', error.message || 'Error al crear usuario');
    }
  };

  const manejarSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      await cambiarPassword(usuarioSeleccionado.id, formDataPassword.password);
      Alerta.exito('Seguridad_Actualizada', 'Contraseña actualizada con éxito');
      cerrarModal();
    } catch (error) {
      Alerta.error('Fallo_Seguridad.exe', error.message || 'Error al cambiar contraseña');
    }
  };

  const manejarSubmitRol = async (e) => {
    e.preventDefault();
    try {
      await cambiarRol(usuarioSeleccionado.id, formDataRol.rol);
      cerrarModal();
    } catch (error) {
      Alerta.error('Error_Rol.exe', error.message || 'Error al cambiar rol');
    }
  };

  if (cargando && !usuarios.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-gris-claro border-2 border-negro shadow-retro p-4 font-mono font-bold">
          [ ] Cargando Base de Datos...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-7xl mx-auto py-6">
      <div className="bg-white border-2 border-negro shadow-retro p-1">
        <div className="bg-azul-oscuro text-white px-3 py-1.5 flex items-center justify-between border-b-2 border-negro">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-celeste" />
            <span className="font-bold font-mono text-xs uppercase tracking-widest">
              GESTION_DE_USUARIOS.EXE
            </span>
          </div>
          <button onClick={cargarUsuarios} className="bg-celeste text-negro text-[10px] font-bold px-1.5 border border-negro uppercase active:translate-y-0.5 cursor-pointer">
            Recargar
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0">Directorio de Usuarios</h1>
              <p className="text-gray-600 font-medium">Administra estudiantes, docentes y editores de la plataforma.</p>
            </div>
            <button
              onClick={abrirModalCrear}
              className="bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold text-sm tracking-wide shadow-retro hover:bg-azul-secundario hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-retro-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              NUEVO USUARIO
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-600 p-3 mb-6 font-mono text-sm font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              ERROR: {error}
            </div>
          )}

          <div className="overflow-x-auto border-2 border-negro">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gris-claro border-b-2 border-negro text-xs uppercase font-bold text-azul-oscuro tracking-wider">
                  <th className="p-3 border-r border-gray-300">ID</th>
                  <th className="p-3 border-r border-gray-300">Nombre</th>
                  <th className="p-3 border-r border-gray-300">Correo</th>
                  <th className="p-3 border-r border-gray-300">Rol</th>
                  <th className="p-3 border-r border-gray-300">Estado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center font-mono text-sm">No hay usuarios registrados.</td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id} className="border-b border-gray-200 hover:bg-yellow-50 transition-colors">
                      <td className="p-3 border-r border-gray-300 font-mono text-xs">{usuario.id}</td>
                      <td className="p-3 border-r border-gray-300 font-bold">{usuario.nombre}</td>
                      <td className="p-3 border-r border-gray-300">{usuario.correo}</td>
                      <td className="p-3 border-r border-gray-300 font-mono">
                        <span className={`px-2 py-0.5 border border-black text-xs font-bold ${
                          usuario.rol === 'ADMIN' ? 'bg-red-200' :
                          usuario.rol === 'DOCENTE' ? 'bg-blue-200' :
                          usuario.rol === 'EDITOR' ? 'bg-yellow-200' : 'bg-green-200'
                        }`}>
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="p-3 border-r border-gray-300 font-mono text-xs">
                        {usuario.estado}
                      </td>
                      <td className="p-3 text-center flex justify-center gap-2">
                        <button
                          onClick={() => abrirModalPassword(usuario)}
                          className="bg-white text-negro border border-negro p-1 hover:bg-gray-200"
                          title="Cambiar Contraseña"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => abrirModalRol(usuario)}
                          className="bg-white text-negro border border-negro p-1 hover:bg-gray-200"
                          title="Cambiar Rol"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalVisible && (
        <div className="fixed inset-0 bg-azul-oscuro/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-negro shadow-retro w-full max-w-md">
            <div className="bg-azul-secundario text-white px-3 py-2 flex justify-between items-center border-b-2 border-negro font-bold font-mono">
              <span>
                {modalTipo === 'CREAR' && 'NUEVO_USUARIO.EXE'}
                {modalTipo === 'PASSWORD' && 'RESET_PASSWORD.EXE'}
                {modalTipo === 'ROL' && 'CONFIG_ROL.EXE'}
              </span>
              <button onClick={cerrarModal} className="text-white bg-red-600 border border-white px-2 hover:bg-red-700">X</button>
            </div>
            
            <div className="p-6">
              {modalTipo === 'CREAR' && (
                <form onSubmit={manejarSubmitCrear} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm uppercase">Nombre Completo</label>
                    <input required type="text" className="border-2 border-negro p-2 font-mono text-sm" value={formDataCrear.nombre} onChange={e => setFormDataCrear({...formDataCrear, nombre: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm uppercase">Correo Electrónico</label>
                    <input required type="email" className="border-2 border-negro p-2 font-mono text-sm" value={formDataCrear.correo} onChange={e => setFormDataCrear({...formDataCrear, correo: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm uppercase">Contraseña</label>
                    <input required type="password" minLength="6" className="border-2 border-negro p-2 font-mono text-sm" value={formDataCrear.password} onChange={e => setFormDataCrear({...formDataCrear, password: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm uppercase">Rol</label>
                    <select className="border-2 border-negro p-2 font-mono text-sm bg-white" value={formDataCrear.rol} onChange={e => setFormDataCrear({...formDataCrear, rol: e.target.value})}>
                      <option value="ESTUDIANTE">ESTUDIANTE</option>
                      <option value="DOCENTE">DOCENTE</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <button type="submit" disabled={cargando} className="mt-4 bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold shadow-retro hover:bg-azul-secundario hover:text-white transition-all disabled:opacity-50">
                    {cargando ? 'PROCESANDO...' : 'CREAR USUARIO'}
                  </button>
                </form>
              )}

              {modalTipo === 'PASSWORD' && (
                <form onSubmit={manejarSubmitPassword} className="flex flex-col gap-4">
                  <div className="bg-yellow-100 border border-black p-2 font-mono text-xs mb-2">
                    Actualizando contraseña para: <strong>{usuarioSeleccionado?.nombre}</strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm uppercase">Nueva Contraseña</label>
                    <input required type="password" minLength="6" className="border-2 border-negro p-2 font-mono text-sm" value={formDataPassword.password} onChange={e => setFormDataPassword({ password: e.target.value })} />
                  </div>
                  <button type="submit" disabled={cargando} className="mt-4 bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold shadow-retro hover:bg-azul-secundario hover:text-white transition-all disabled:opacity-50">
                    {cargando ? 'PROCESANDO...' : 'ACTUALIZAR CONTRASEÑA'}
                  </button>
                </form>
              )}

              {modalTipo === 'ROL' && (
                <form onSubmit={manejarSubmitRol} className="flex flex-col gap-4">
                  <div className="bg-yellow-100 border border-black p-2 font-mono text-xs mb-2">
                    Actualizando rol para: <strong>{usuarioSeleccionado?.nombre}</strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm uppercase">Nuevo Rol</label>
                    <select className="border-2 border-negro p-2 font-mono text-sm bg-white" value={formDataRol.rol} onChange={e => setFormDataRol({ rol: e.target.value })}>
                      <option value="ESTUDIANTE">ESTUDIANTE</option>
                      <option value="DOCENTE">DOCENTE</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <button type="submit" disabled={cargando} className="mt-4 bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold shadow-retro hover:bg-azul-secundario hover:text-white transition-all disabled:opacity-50">
                    {cargando ? 'PROCESANDO...' : 'ACTUALIZAR ROL'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
