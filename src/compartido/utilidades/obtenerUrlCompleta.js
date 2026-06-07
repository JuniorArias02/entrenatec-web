export const obtenerUrlCompleta = (url) => {
  if (!url) return '';
  // Si la URL ya es absoluta (http, https, blob o data), la retornamos tal cual.
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // Obtenemos la base URL de la API desde el entorno y le quitamos el "/api" final
  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
  const baseUrl = apiUrl.replace(/\/api\/?$/, '');

  // Nos aseguramos que la ruta tenga el slash inicial
  const pathNormalizado = url.startsWith('/') ? url : `/${url}`;

  return `${baseUrl}${pathNormalizado}`;
};
