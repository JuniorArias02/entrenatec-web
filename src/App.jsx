import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRutas from './compartido/rutas/AppRutas';

/**
 * Componente Raíz de la Aplicación.
 * Envuelve el enrutador global y define los proveedores necesarios.
 */
function App() {
  return (
    <BrowserRouter>
      <AppRutas />
    </BrowserRouter>
  );
}

export default App;
