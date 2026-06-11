import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import usarAutenticacion from '../hooks/usarAutenticacion';
import clienteHttp from '@/compartido/infraestructura/api/clienteHttp';
import { Terminal, Key, Monitor, ArrowRight, UserPlus, Zap, Shield, Cpu, Wifi } from 'lucide-react';
import { NOMBRE_SISTEMA } from '@/compartido/constantes/version';

/* ─── Pequeño componente: líneas de "boot" animadas ─── */
function BootLines({ visible }) {
  const lines = [
    'INITIALIZING SECURE CONNECTION...',
    'LOADING ENTRENATECH KERNEL v2.0.4...',
    'CHECKING USER PERMISSIONS...',
    'AUTHENTICATION MODULE READY.',
  ];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setShown(0);
    const interval = setInterval(() => {
      setShown((prev) => {
        if (prev >= lines.length) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 320);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;
  return (
    <div className="absolute inset-0 bg-negro z-50 flex flex-col justify-center items-start p-10 font-mono text-celeste text-sm gap-2 animate-fadeOut">
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} className="flex items-center gap-2 animate-slideInLeft">
          <span className="text-verde">{'>'}</span>
          <span>{l}</span>
          {i === shown - 1 && <span className="inline-block w-2 h-4 bg-celeste animate-blink ml-1" />}
        </div>
      ))}
    </div>
  );
}

/* ─── Grid animado de fondo (partículas hex) ─── */
function HexGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Grid perspectiva inferior */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(79,195,247,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: 'perspective(400px) rotateX(55deg) translateY(30%)',
          transformOrigin: 'bottom center',
        }}
      />
      {/* Scanlines CRT */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.3) 50%)',
          backgroundSize: '100% 3px',
        }}
      />
      {/* Puntos flotantes decorativos */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-celeste rounded-full opacity-60"
          style={{
            left: `${10 + i * 16}%`,
            top: `${15 + (i % 3) * 25}%`,
            animation: `floatDot ${2 + i * 0.4}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Ticker de estado inferior ─── */
function StatusTicker({ mode }) {
  const items = mode === 'login'
    ? ['SECURE CHANNEL ACTIVE', 'AES-256 ENCRYPTION', 'WAITING FOR CREDENTIALS', 'ENTRENATECH OS v2.0']
    : ['IDENTITY CREATION MODE', 'VALIDATING FIELDS', 'SECURE REGISTRATION', 'ENTRENATECH OS v2.0'];

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="inline-flex gap-12 animate-ticker font-mono text-[10px] text-gray-500 uppercase">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-celeste">◆</span>{item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Componente Input retro mejorado ─── */
function RetroInput({ label, icon: Icon, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="font-bold text-negro uppercase text-xs flex items-center gap-2 tracking-widest">
        <span className={`transition-colors duration-200 ${focused ? 'text-celeste' : 'text-gray-400'}`}>▶</span>
        {label}
      </label>
      <div className={`relative transition-all duration-200 ${focused ? 'shadow-[0_0_0_3px_#4FC3F7,4px_4px_0_0_#000]' : 'shadow-[4px_4px_0_0_#000]'}`}>
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className={`w-4 h-4 transition-colors duration-200 ${focused ? 'text-celeste' : 'text-gray-400'}`} />
          </div>
        )}
        <input
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full border-2 border-negro bg-white py-3 font-medium focus:outline-none text-negro transition-all duration-150 text-sm ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
        />
        <div className={`absolute right-0 top-0 bottom-0 w-1 bg-celeste transition-transform duration-200 ${focused ? 'scale-y-100' : 'scale-y-0'}`} style={{ transformOrigin: 'top' }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function AuthPagina() {
  const [esLogin, setEsLogin] = useState(true);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [errorLocal, setErrorLocal] = useState('');
  const [cargandoEnvio, setCargandoEnvio] = useState(false);
  const [booting, setBooting] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [successFlash, setSuccessFlash] = useState(false);

  const navigate = useNavigate();
  const { iniciarSesion, estaAutenticado } = usarAutenticacion();

  useEffect(() => {
    if (estaAutenticado) navigate('/inicio');
  }, [estaAutenticado, navigate]);

  /* Boot animation al montar */
  useEffect(() => {
    const t1 = setTimeout(() => setBooting(false), 1600);
    const t2 = setTimeout(() => setMounted(true), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const alternarModo = () => {
    setSwitching(true);
    setTimeout(() => {
      setEsLogin(!esLogin);
      setErrorLocal('');
      setSwitching(false);
    }, 200);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorLocal('');
    setCargandoEnvio(true);
    try {
      if (esLogin) {
        await iniciarSesion(correo, password);
        setSuccessFlash(true);
        setTimeout(() => navigate('/inicio'), 600);
      } else {
        await clienteHttp.post('/auth/registro', { nombre, correo, password });
        await iniciarSesion(correo, password);
        navigate('/inicio');
      }
    } catch (err) {
      setErrorLocal(err?.message || 'Error de conexión.');
    } finally {
      setCargandoEnvio(false);
    }
  };

  return (
    <>
      {/* ── Estilos inline para animaciones custom ── */}
      <style>{`
        @keyframes floatDot {
          from { transform: translateY(0px); opacity: 0.4; }
          to   { transform: translateY(-12px); opacity: 1; }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOut {
          0%, 80% { opacity: 1; }
          100%     { opacity: 0; pointer-events: none; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes scanH {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 8px #4FC3F7, 4px 4px 0 #000; }
          50%       { box-shadow: 0 0 20px #4FC3F7, 4px 4px 0 #000; }
        }
        @keyframes successBg {
          0%   { background-color: transparent; }
          50%  { background-color: rgba(79,195,247,0.15); }
          100% { background-color: transparent; }
        }
        .animate-ticker        { animation: ticker 14s linear infinite; }
        .animate-slideInLeft   { animation: slideInLeft 0.3s ease forwards; }
        .animate-slideUp       { animation: slideUp 0.5s cubic-bezier(.22,1,.36,1) forwards; }
        .animate-slideInRight  { animation: slideInRight 0.6s cubic-bezier(.22,1,.36,1) forwards; }
        .animate-fadeInScale   { animation: fadeInScale 0.5s cubic-bezier(.22,1,.36,1) forwards; }
        .animate-fadeOut       { animation: fadeOut 1.5s ease forwards; }
        .animate-blink         { animation: blink 0.8s step-end infinite; }
        .animate-glowPulse     { animation: glowPulse 2s ease-in-out infinite; }
        .animate-successBg     { animation: successBg 0.6s ease; }
        .delay-100  { animation-delay: 0.1s; opacity: 0; animation-fill-mode: forwards; }
        .delay-200  { animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards; }
        .delay-300  { animation-delay: 0.3s; opacity: 0; animation-fill-mode: forwards; }
        .delay-400  { animation-delay: 0.4s; opacity: 0; animation-fill-mode: forwards; }
        .delay-500  { animation-delay: 0.5s; opacity: 0; animation-fill-mode: forwards; }
        .scan-line {
          position: absolute;
          left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(79,195,247,0.6), transparent);
          animation: scanH 4s linear infinite;
          pointer-events: none;
          z-index: 5;
        }
        .text-verde { color: #4ade80; }
      `}</style>

      <div className={`min-h-screen w-full flex flex-col md:flex-row overflow-hidden font-sans text-white select-none bg-gris-claro relative transition-all duration-300 ${successFlash ? 'animate-successBg' : ''}`}>

        {/* ── Boot overlay ── */}
        <BootLines visible={booting} />

        {/* ════════════════════════════════
            PANEL IZQUIERDO — Marca Y2K
        ════════════════════════════════ */}
        <div className={`relative w-full md:w-5/12 lg:w-[42%] md:h-screen flex flex-col items-center justify-center bg-negro overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-celeste transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

          <HexGrid />

          {/* Scan line activa */}
          <div className="scan-line" />

          {/* Contenido central */}
          <div className="relative z-20 flex flex-col items-center gap-6 px-8 py-12 md:py-0">

            {/* Ícono principal con glow */}
            {mounted && (
              <div className="animate-slideUp delay-100 relative">
                <div className="w-28 h-28 md:w-36 md:h-36 bg-celeste border-4 border-white flex items-center justify-center relative overflow-hidden animate-glowPulse">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                  <Monitor className="w-14 h-14 md:w-18 md:h-18 text-negro relative z-10" />
                  {/* Esquinas decorativas */}
                  <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-white/60" />
                  <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-white/60" />
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-white/60" />
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-white/60" />
                </div>
                {/* Sombra retro */}
                <div className="absolute -bottom-2 -right-2 w-full h-full bg-azul-secundario -z-10" />
              </div>
            )}

            {/* Nombre del sistema */}
            {mounted && (
              <div className="animate-slideUp delay-200 text-center">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tighter leading-none">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-celeste">{NOMBRE_SISTEMA}</span>
                </h1>
                <div className="mt-1 h-1 bg-celeste w-full" />
              </div>
            )}

            {/* Badge */}
            {mounted && (
              <div className="animate-slideUp delay-300 flex flex-col items-center gap-2">
                <div className="bg-azul-secundario border-2 border-white px-5 py-1.5 font-mono text-xs uppercase tracking-widest shadow-[3px_3px_0_0_#4FC3F7]">
                  ◆ PORTAL DE ACCESO SEGURO ◆
                </div>
              </div>
            )}

            {/* Stats/badges decorativos */}
            {mounted && (
              <div className="animate-slideUp delay-400 flex gap-3 mt-2">
                {[
                  { icon: Shield, label: 'SEGURO' },
                  { icon: Cpu, label: 'RÁPIDO' },
                  { icon: Wifi, label: 'ONLINE' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 border border-celeste/40 bg-white/5 px-3 py-2 font-mono text-[9px] text-celeste uppercase tracking-widest hover:bg-celeste/10 transition-colors">
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                ))}
              </div>
            )}

            {/* Barra de progreso decorativa */}
            {mounted && (
              <div className="animate-slideUp delay-500 w-full font-mono text-[10px] text-gray-400 mt-2">
                <div className="flex justify-between mb-1 uppercase tracking-widest">
                  <span>SYSTEM LOAD</span><span className="text-celeste">98.4%</span>
                </div>
                <div className="h-2 bg-white/10 border border-celeste/30 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-celeste to-azul-secundario" style={{ width: '98.4%' }} />
                  <div className="absolute inset-y-0 right-0 w-1 bg-white animate-blink" />
                </div>
              </div>
            )}
          </div>

          {/* Link volver */}
          <Link
            to="/"
            className="absolute top-4 left-4 z-20 text-xs font-mono bg-negro/80 border border-gray-600 px-3 py-1.5 text-gray-400 hover:text-celeste hover:border-celeste transition-all flex items-center gap-1.5 backdrop-blur-sm"
          >
            ← VOLVER
          </Link>

          {/* Versión */}
          <div className="absolute bottom-4 right-4 z-20 font-mono text-[9px] text-gray-600 uppercase">
            OS 2.0.4 BUILD 2024
          </div>
        </div>

        {/* ════════════════════════════════
            PANEL DERECHO — Formulario
        ════════════════════════════════ */}
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(79,195,247,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(37,99,235,0.06) 0%, transparent 50%), linear-gradient(rgba(79,195,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.05) 1px, transparent 1px)`,
            backgroundSize: 'auto, auto, 24px 24px, 24px 24px',
          }}
        >
          {/* Decoración de esquina superior derecha */}
          <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none">
            <div className="absolute top-4 right-4 w-full h-full border-t-2 border-r-2 border-celeste" />
            <div className="absolute top-8 right-8 w-3/4 h-3/4 border-t border-r border-celeste" />
          </div>
          <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 pointer-events-none">
            <div className="absolute bottom-4 left-4 w-full h-full border-b-2 border-l-2 border-negro" />
          </div>

          {/* ── Tarjeta del formulario ── */}
          <div
            className={`w-full max-w-md relative transition-all duration-200 ease-in-out ${switching ? 'opacity-0 scale-95 -translate-x-3' : ''} ${mounted ? 'animate-slideInRight' : 'opacity-0'}`}
          >
            {/* Sombra retro de la tarjeta */}
            <div className="absolute -bottom-3 -right-3 w-full h-full bg-negro z-0 rounded-none" />
            <div className="absolute -bottom-1.5 -right-1.5 w-full h-full bg-azul-secundario z-0 rounded-none" />

            <div className="relative z-10 bg-gris-claro border-4 border-negro overflow-hidden">

              {/* ── Barra de título Windows ── */}
              <div className="bg-azul-oscuro text-white px-4 py-2 flex justify-between items-center border-b-4 border-negro">
                <div className="flex items-center gap-2.5 font-bold uppercase tracking-wider text-xs">
                  <div className="w-2 h-2 bg-celeste animate-blink" />
                  <Terminal className="w-3.5 h-3.5 text-celeste" />
                  <span className="font-mono">{esLogin ? 'AUTH_LOGIN.EXE' : 'AUTH_REGISTER.EXE'}</span>
                </div>
                <div className="flex gap-1">
                  {['_', '□', 'X'].map((c, i) => (
                    <div key={i} className="w-5 h-5 border border-white/60 flex items-center justify-center text-[9px] font-bold cursor-default hover:bg-white/20 transition-colors font-mono">
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Tab de modo (Login/Registro) ── */}
              <div className="flex border-b-4 border-negro">
                {['Iniciar Sesión', 'Crear Cuenta'].map((tab, i) => {
                  const isActive = (i === 0) === esLogin;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => { if ((i === 0) !== esLogin) alternarModo(); }}
                      className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest font-mono transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer border-r last:border-r-0 border-negro ${isActive ? 'bg-celeste text-negro shadow-[inset_0_-3px_0_0_#000]' : 'bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-negro'}`}
                    >
                      {i === 0 ? <Key className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* ── Cuerpo del formulario ── */}
              <div className="p-6 md:p-8">

                {/* Encabezado */}
                <div className="mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">
                        {'>'} {esLogin ? 'SESSION_INIT' : 'IDENTITY_CREATE'}
                      </p>
                      <h2 className="text-2xl font-extrabold uppercase text-azul-oscuro leading-tight tracking-tight">
                        {esLogin ? 'Bienvenido de vuelta' : 'Únete al sistema'}
                      </h2>
                    </div>
                    <div className="bg-azul-oscuro border-2 border-celeste p-2">
                      <Zap className="w-5 h-5 text-celeste" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs font-mono mt-2 leading-relaxed">
                    {esLogin
                      ? '// Ingresa tus credenciales para continuar'
                      : '// Completa el formulario para crear tu identidad'}
                  </p>
                </div>

                {/* Error */}
                {errorLocal && (
                  <div className="bg-red-50 border-2 border-negro text-red-700 px-4 py-3 font-bold uppercase mb-5 shadow-[3px_3px_0_0_#000] text-xs font-mono flex items-center gap-2 animate-slideUp">
                    <span className="text-red-500 text-base leading-none">■</span>
                    <span>[ERROR] {errorLocal}</span>
                  </div>
                )}

                <form onSubmit={manejarEnvio} className="space-y-4">

                  {!esLogin && (
                    <RetroInput
                      label="Nombre Completo"
                      icon={UserPlus}
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required={!esLogin}
                      placeholder="Ej. Juan Pérez"
                    />
                  )}

                  <RetroInput
                    label="Correo Electrónico"
                    icon={Terminal}
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    placeholder="estudiante@ejemplo.com"
                  />

                  <RetroInput
                    label="Contraseña"
                    icon={Key}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />

                  {/* Botón principal */}
                  <button
                    type="submit"
                    disabled={cargandoEnvio}
                    className="w-full mt-2 bg-celeste text-negro border-2 border-negro py-3.5 font-extrabold uppercase tracking-widest text-sm shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_0_#000] transition-all duration-100 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-wait group relative overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12 pointer-events-none" />
                    {cargandoEnvio ? (
                      <span className="flex items-center gap-2 font-mono">
                        <span className="animate-spin">◈</span> PROCESANDO...
                      </span>
                    ) : (
                      <>
                        {esLogin ? <Key className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        {esLogin ? 'AUTENTICAR ACCESO' : 'CREAR CUENTA'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
                      </>
                    )}
                  </button>
                </form>

                {/* Separador */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-300" />
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>

                {/* Switch modo */}
                <div className="mt-4 text-center">
                  <p className="text-gray-500 text-xs font-mono mb-3">
                    {esLogin ? '// ¿Usuario nuevo en el sistema?' : '// ¿Ya tienes una cuenta activa?'}
                  </p>
                  <button
                    onClick={alternarModo}
                    type="button"
                    className="border-2 border-negro px-5 py-2 font-bold uppercase text-xs tracking-widest bg-white text-negro hover:bg-negro hover:text-white transition-all duration-150 shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] inline-flex items-center gap-2 cursor-pointer font-mono"
                  >
                    {esLogin
                      ? <><UserPlus className="w-3.5 h-3.5" /> SOLICITAR ACCESO</>
                      : <><ArrowRight className="w-3.5 h-3.5" /> IR A LOGIN</>
                    }
                  </button>
                </div>
              </div>

              {/* ── Status Bar ── */}
              <div className="bg-gray-200 border-t-2 border-negro px-3 py-1.5 overflow-hidden">
                <StatusTicker mode={esLogin ? 'login' : 'register'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}