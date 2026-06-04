import React from 'react';
import usarAutenticacion from '@/modulos/autenticacion/presentacion/hooks/usarAutenticacion';

/**
 * Componente universal para renderizado condicional basado en roles.
 * Solo muestra su contenido (children) si el usuario actual tiene
 * uno de los roles especificados en `rolesPermitidos`.
 * 
 * @param {Object} props
 * @param {Array<string>} props.rolesPermitidos - Ejemplo: ['ADMIN', 'DOCENTE']
 * @param {React.ReactNode} props.children - El contenido a proteger
 */
export default function AutorizacionRol({ rolesPermitidos, children }) {
  const { sesion } = usarAutenticacion();
  const rolActivo = sesion?.rol || 'ESTUDIANTE';

  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return children;
  }

  if (rolesPermitidos.includes(rolActivo)) {
    return children;
  }

  // Si no tiene el rol, no renderizamos nada
  return null;
}
