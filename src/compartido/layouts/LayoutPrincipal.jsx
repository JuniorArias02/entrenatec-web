import React from 'react';
import { Outlet } from 'react-router-dom';
import BarraNavegacion from './BarraNavegacion';
import BarraLateral from './BarraLateral';

export default function LayoutPrincipal() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gris-claro font-sans text-azul-oscuro">
      {/* Barra de navegación superior */}
      <BarraNavegacion />

      {/* Contenedor del Cuerpo */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Barra lateral */}
        <BarraLateral />

        {/* Contenedor del Contenido Principal */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-grid-patron flex flex-col min-h-[500px]">
          <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
