import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import PublicoLayout from '../layouts/PublicoLayout';
import InicioPagina from '@/modulos/inicio/presentacion/paginas/InicioPagina';
import LandingPagina from '@/modulos/autenticacion/presentacion/paginas/LandingPagina';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';

/**
 * Guard para proteger rutas que requieren autenticación.
 * Realiza verificación y refresco automático de token en caso de que esté por expirar.
 */
function RutaProtegida({ children }) {
  const { estaAutenticado, sesion, refrescarSesion } = usarAutenticacion();

  React.useEffect(() => {
    if (sesion) {
      const verificarYRefrescar = async () => {
        try {
          const tiempoTranscurrido = (Date.now() - sesion.guardadoEn) / 1000;
          const tiempoRestante = sesion.expiraEn - tiempoTranscurrido;
          
          // Si quedan menos de 600 segundos (10 minutos) de validez, refrescamos el token
          if (tiempoRestante < 600 && tiempoRestante > 0) {
            console.log('El token de sesión está por expirar. Refrescando automáticamente...');
            await refrescarSesion();
          }
        } catch (e) {
          console.error('No se pudo refrescar el token de sesión:', e);
        }
      };

      verificarYRefrescar();
      
      // Chequear cada minuto mientras esté montado
      const intervalo = setInterval(verificarYRefrescar, 60000);
      return () => clearInterval(intervalo);
    }
  }, [sesion, refrescarSesion]);

  return estaAutenticado ? children : <Navigate to="/" replace />;
}

/**
 * Guard para proteger rutas públicas y redirigir si ya hay sesión.
 */
function RutaPublica({ children }) {
  const { estaAutenticado } = usarAutenticacion();
  return !estaAutenticado ? children : <Navigate to="/inicio" replace />;
}

/**
 * Enrutador Principal de la Aplicación.
 * Registra las rutas globales y asocia los layouts y páginas correspondientes.
 */
export default function AppRutas() {
  return (
    <Routes>
      {/* Grupo de rutas públicas (Landing Page, etc.) */}
      <Route element={<RutaPublica><PublicoLayout /></RutaPublica>}>
        <Route path="/" element={<LandingPagina />} />
      </Route>
      
      {/* Layout Principal que envuelve todas las vistas internas protegidas */}
      <Route element={<RutaProtegida><LayoutPrincipal /></RutaProtegida>}>
        {/* Página de Inicio / Dashboard */}
        <Route path="/inicio" element={<InicioPagina />} />
        
        {/* Rutas temporales para los otros módulos */}
        <Route path="/temas" element={
          <div className="bg-white border-2 border-negro shadow-retro p-6 max-w-2xl mx-auto my-8">
            <div className="bg-azul-secundario text-white px-3 py-1 font-bold text-xs uppercase flex justify-between border-b-2 border-negro mb-4">
              <span>EXPLORADOR_TEMAS.EXE</span>
              <span>[ ] X</span>
            </div>
            <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0 pb-2">
              Módulo de Temas
            </h1>
            <p className="text-gray-700 font-medium mt-3">
              Aquí se renderizará el creador y visualizador dinámico de temas con el <code className="bg-gray-100 text-red-600 px-1 border border-gray-300">RenderizadorBloques</code>.
            </p>
            <div className="mt-6 flex justify-end">
              <Link 
                to="/inicio" 
                className="bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold text-xs shadow-retro-sm hover:bg-azul-secundario hover:text-white transition-all"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        } />

        <Route path="/materias" element={
          <div className="bg-white border-2 border-negro shadow-retro p-6 max-w-2xl mx-auto my-8 bg-checkerboard">
            <div className="bg-white border-2 border-black p-6 shadow-retro-sm">
              <div className="bg-azul-oscuro text-white px-3 py-1 font-bold text-xs uppercase flex justify-between border-b-2 border-negro mb-4">
                <span>MATERIAS_SISTEMA.EXE</span>
                <span>[ ] X</span>
              </div>
              <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0 pb-2">
                Módulo de Materias
              </h1>
              <p className="text-gray-700 font-medium mt-3">
                Listado de materias, planes y mallas curriculares. Se integrará con el caso de uso del dominio.
              </p>
              <div className="mt-6 flex justify-end">
                <Link 
                  to="/inicio" 
                  className="bg-white text-negro border-2 border-negro px-4 py-2 font-bold text-xs shadow-retro-sm hover:bg-gris-claro transition-all"
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        } />

        <Route path="/usuarios" element={
          <div className="bg-white border-2 border-negro shadow-retro p-6 max-w-2xl mx-auto my-8">
            <div className="bg-azul-oscuro text-white px-3 py-1 font-bold text-xs uppercase flex justify-between border-b-2 border-negro mb-4">
              <span>ADMIN_USUARIOS.EXE</span>
              <span>[ ] X</span>
            </div>
            <h1 className="text-3xl font-extrabold uppercase text-azul-oscuro m-0 pb-2">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-700 font-medium mt-3">
              Módulo de usuarios y roles (Profesores, Estudiantes, Administradores).
            </p>
            <div className="mt-6 flex justify-end">
              <Link 
                to="/inicio" 
                className="bg-celeste text-negro border-2 border-negro px-4 py-2 font-bold text-xs shadow-retro-sm hover:bg-azul-secundario hover:text-white transition-all"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        } />
      </Route>

      {/* Captura de rutas no existentes (404) */}
      <Route path="*" element={
        <div className="bg-red-50 border-2 border-negro shadow-retro p-6 max-w-md mx-auto my-12 text-center">
          <div className="bg-red-600 text-white px-3 py-1.5 font-bold text-xs uppercase flex items-center justify-center gap-2 mb-4">
            <span>ERROR 404: ARCHIVO NO ENCONTRADO</span>
          </div>
          <h2 className="text-2xl font-extrabold text-red-600 uppercase m-0">
            Ruta Inexistente
          </h2>
          <p className="text-gray-700 font-mono text-xs mt-3">
            El sistema operativo EntrenaTech OS no pudo ubicar el recurso solicitado en el clúster local.
          </p>
          <div className="mt-6">
            <Link 
              to="/" 
              className="bg-white text-negro border-2 border-negro px-4 py-2 font-bold text-xs shadow-retro-sm hover:bg-gris-claro transition-all inline-block"
            >
              Volver a la Interfaz Principal
            </Link>
          </div>
        </div>
      } />
    </Routes>
  );
}
