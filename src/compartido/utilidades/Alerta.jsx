import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, CheckCircle, Info, XCircle, Terminal } from 'lucide-react';

const AlertaComponent = ({ titulo, mensaje, tipo, textoConfirmar, textoCancelar, mostrarCancelar, alAceptar, alCerrar }) => {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    // Pequeño delay para la animación de entrada
    setAbierto(true);
  }, []);

  const handleCerrar = (resultado) => {
    setAbierto(false);
    setTimeout(() => {
      if (resultado && alAceptar) alAceptar();
      if (alCerrar) alCerrar(resultado);
    }, 200); // Esperar a que termine la animación
  };

  const configuracion = {
    exito: { icono: CheckCircle, colorBarra: 'bg-green-600', colorTexto: 'text-green-600' },
    error: { icono: XCircle, colorBarra: 'bg-red-600', colorTexto: 'text-red-600' },
    advertencia: { icono: AlertTriangle, colorBarra: 'bg-yellow-500', colorTexto: 'text-yellow-600' },
    info: { icono: Info, colorBarra: 'bg-azul-secundario', colorTexto: 'text-azul-secundario' },
    sistema: { icono: Terminal, colorBarra: 'bg-azul-oscuro', colorTexto: 'text-azul-oscuro' }
  };

  const config = configuracion[tipo] || configuracion.info;
  const Icono = config.icono;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-200 ${abierto ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}>
      <div 
        className={`bg-white border-4 border-negro shadow-retro max-w-md w-full flex flex-col transform transition-all duration-200 ${abierto ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {/* Barra Superior estilo Windows 95 */}
        <div className={`${config.colorBarra} text-white px-3 py-1.5 border-b-4 border-negro flex items-center justify-between`}>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
            <Icono className="w-4 h-4" />
            <span>Alerta_Sistema.exe</span>
          </div>
          <button 
            onClick={() => handleCerrar(false)}
            className="bg-gray-200 text-negro px-1.5 py-0.5 border-2 border-transparent hover:border-negro hover:bg-red-500 hover:text-white transition-colors cursor-pointer text-[10px] font-bold"
          >
            X
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 bg-checkerboard flex flex-col items-center text-center gap-4">
          <div className={`p-4 border-4 border-negro bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] ${config.colorTexto}`}>
            <Icono className="w-12 h-12" />
          </div>
          
          <div className="bg-white border-2 border-negro p-4 w-full shadow-retro-sm">
            <h2 className="text-xl font-extrabold uppercase text-negro mb-2 font-rajdhani">{titulo}</h2>
            <p className="text-gray-700 font-mono text-sm leading-relaxed">{mensaje}</p>
          </div>
        </div>

        {/* Botones */}
        <div className="p-4 bg-gray-100 border-t-4 border-negro flex justify-end gap-3">
          {mostrarCancelar && (
            <button 
              onClick={() => handleCerrar(false)}
              className="bg-white text-negro border-2 border-negro px-4 py-2 font-bold font-mono text-xs uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-200 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer"
            >
              {textoCancelar}
            </button>
          )}
          <button 
            onClick={() => handleCerrar(true)}
            className="bg-celeste text-negro border-2 border-negro px-6 py-2 font-bold font-mono text-xs uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-azul-secundario hover:text-white hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer"
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

class AlertaManager {
  mostrar({
    titulo = 'Atención',
    mensaje = '',
    tipo = 'info', // exito, error, advertencia, info, sistema
    textoConfirmar = 'Aceptar',
    textoCancelar = 'Cancelar',
    mostrarCancelar = false,
  }) {
    return new Promise((resolve) => {
      // Crear contenedor si no existe
      const divContenedor = document.createElement('div');
      document.body.appendChild(divContenedor);
      const root = createRoot(divContenedor);

      const desmontar = (resultado) => {
        root.unmount();
        if (divContenedor.parentNode) {
          divContenedor.parentNode.removeChild(divContenedor);
        }
        resolve(resultado);
      };

      root.render(
        <AlertaComponent 
          titulo={titulo}
          mensaje={mensaje}
          tipo={tipo}
          textoConfirmar={textoConfirmar}
          textoCancelar={textoCancelar}
          mostrarCancelar={mostrarCancelar}
          alCerrar={desmontar}
        />
      );
    });
  }

  exito(titulo, mensaje) {
    return this.mostrar({ titulo, mensaje, tipo: 'exito' });
  }

  error(titulo, mensaje) {
    return this.mostrar({ titulo, mensaje, tipo: 'error' });
  }

  advertencia(titulo, mensaje) {
    return this.mostrar({ titulo, mensaje, tipo: 'advertencia' });
  }

  info(titulo, mensaje) {
    return this.mostrar({ titulo, mensaje, tipo: 'info' });
  }

  confirmar(titulo, mensaje, textoConfirmar = 'Sí, continuar', textoCancelar = 'Cancelar') {
    return this.mostrar({ 
      titulo, 
      mensaje, 
      tipo: 'advertencia', 
      textoConfirmar, 
      textoCancelar, 
      mostrarCancelar: true 
    });
  }
}

export const Alerta = new AlertaManager();
