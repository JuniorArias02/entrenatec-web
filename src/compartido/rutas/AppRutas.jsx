import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import PublicoLayout from '../layouts/PublicoLayout';
import InicioPagina from '@/modulos/inicio/presentacion/paginas/InicioPagina';
import LandingPagina from '@/modulos/autenticacion/presentacion/paginas/LandingPagina';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';

// Páginas de los Módulos Curriculares
import SeleccionGradosPagina from '@/modulos/grados/presentacion/paginas/SeleccionGradosPagina';
import SeleccionPeriodosPagina from '@/modulos/periodos/presentacion/paginas/SeleccionPeriodosPagina';
import DetallePeriodoPagina from '@/modulos/periodos/presentacion/paginas/DetallePeriodoPagina';
import DetalleTemaPagina from '@/modulos/temas/presentacion/paginas/DetalleTemaPagina';
import CrearTemaPagina from '@/modulos/temas/presentacion/paginas/CrearTemaPagina';
import GestionUsuariosPagina from '@/modulos/usuarios/presentacion/paginas/GestionUsuariosPagina';
import GestionQuizzesPagina from '@/modulos/quizzes/presentacion/paginas/GestionQuizzesPagina';

/**
 * Guard para proteger rutas que requieren autenticación.
 * Realiza verificación y refresco automático de token en caso de que esté por expirar.
 */
function RutaProtegida({ children, rolesPermitidos }) {
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

  if (!estaAutenticado) return <Navigate to="/" replace />;
  
  // Verificación de roles (si la ruta exige roles específicos y la sesión tiene un rol definido)
  if (rolesPermitidos && sesion?.rol) {
    if (!rolesPermitidos.includes(sesion.rol)) {
      return <Navigate to="/inicio" replace />;
    }
  }

  return children;
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
        {/* Página de Inicio / Dashboard (Accesible por todos los roles) */}
        <Route path="/inicio" element={<InicioPagina />} />
        
        {/* Módulos Curriculares (Exploración para Estudiantes y vista general) */}
        <Route path="/grados" element={<SeleccionGradosPagina />} />
        <Route path="/grados/:gradoId/periodos" element={<SeleccionPeriodosPagina />} />
        <Route path="/grados/:gradoId/periodos/:periodoId" element={<DetallePeriodoPagina />} />
        <Route path="/temas/:temaId" element={<DetalleTemaPagina />} />

        {/* Creación y edición de Temas (Solo ADMIN y DOCENTE) */}
        <Route path="/temas/crear" element={
          <RutaProtegida rolesPermitidos={['ADMIN', 'DOCENTE', 'EDITOR']}>
            <CrearTemaPagina />
          </RutaProtegida>
        } />

        {/* Redirecciones de accesos rápidos */}
        <Route path="/temas" element={<Navigate to="/grados" replace />} />
        <Route path="/materias" element={<Navigate to="/grados" replace />} />

        {/* Ruta para el perfil / administración de usuarios (Solo ADMIN) */}
        <Route path="/usuarios" element={
          <RutaProtegida rolesPermitidos={['ADMIN']}>
            <GestionUsuariosPagina />
          </RutaProtegida>
        } />

        {/* Ruta para el Creador de Quizzes (DOCENTES y ADMIN) */}
        <Route path="/quizzes" element={
          <RutaProtegida rolesPermitidos={['ADMIN', 'DOCENTE', 'EDITOR']}>
            <GestionQuizzesPagina />
          </RutaProtegida>
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
            El sistema operativo EntrenaTec OS no pudo ubicar el recurso solicitado en el clúster local.
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
