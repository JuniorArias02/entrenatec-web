import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BarraNavegacion from './BarraNavegacion';
import BarraLateral from './BarraLateral';

export default function LayoutPrincipal() {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-gris-claro font-sans text-azul-oscuro overflow-hidden">
      {/* Barra de navegación superior */}
      <BarraNavegacion toggleMenu={() => setMenuMovilAbierto(!menuMovilAbierto)} />

      {/* Contenedor del Cuerpo */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        {/* Barra lateral */}
        <BarraLateral 
          menuMovilAbierto={menuMovilAbierto} 
          setMenuMovilAbierto={setMenuMovilAbierto} 
        />

        {/* Contenedor del Contenido Principal */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-grid-patron flex flex-col">
          <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
