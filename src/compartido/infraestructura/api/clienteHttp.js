import axios from 'axios';

const clienteHttp = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

clienteHttp.interceptors.request.use(
  (config) => {
    const sesionDatos = localStorage.getItem('entrenatech_sesion');
    if (sesionDatos) {
      try {
        const { token } = JSON.parse(sesionDatos);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // Ignorar error de parseo
      }
    }
    
    // Si se está enviando un FormData, dejar que el navegador asigne el Content-Type y boundaries
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

clienteHttp.interceptors.response.use(
  (response) => {
    // Si el backend siempre responde con { error: false, datos: ... }
    // Devolvemos directamente los datos si no hay error
    if (response.data && response.data.error === false && response.data.datos !== undefined) {
       return response.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.data && error.response.data.mensaje) {
      error.message = error.response.data.mensaje;
    }
    return Promise.reject(error);
  }
);

export default clienteHttp;
