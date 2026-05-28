import PeriodoRepositorio from '../../dominio/contratos/PeriodoRepositorio';
import Periodo from '../../dominio/entidades/Periodo';

/**
 * Implementación en memoria del repositorio de Periodos.
 */
export default class MemoriaPeriodoRepositorio extends PeriodoRepositorio {
  constructor() {
    super();
    this.periodos = [
      // Grado 9
      new Periodo({
        id: 'p-9-1',
        gradoId: 'grado-9',
        nombre: 'Periodo I: Fundamentos de Lógica',
        descripcion: 'Exploración de la resolución de problemas y la lógica de programación.',
        cuadroTeorico: 'La lógica de programación es la habilidad para resolver problemas informáticos mediante un conjunto ordenado de instrucciones. En este periodo inicial, aprenderás a pensar de manera lógica y estructurada, dividiendo problemas complejos en pasos más sencillos y ordenados (pensamiento computacional).'
      }),
      new Periodo({
        id: 'p-9-2',
        gradoId: 'grado-9',
        nombre: 'Periodo II: Pseudocódigo y Diagramas',
        descripcion: 'Estructuración formal de algoritmos de forma comprensible.',
        cuadroTeorico: 'El pseudocódigo es un lenguaje de especificación de algoritmos que utiliza palabras en español. Los diagramas de flujo representan gráficamente esta secuencia de pasos. Ambos permiten planificar el código antes de escribirlo en un lenguaje real.'
      }),
      new Periodo({
        id: 'p-9-3',
        gradoId: 'grado-9',
        nombre: 'Periodo III: Estructuras Condicionales',
        descripcion: 'Toma de decisiones lógicas en la ejecución del flujo de datos.',
        cuadroTeorico: 'Los algoritmos necesitan tomar decisiones según se cumplan o no ciertas condiciones. Las estructuras condicionales (SI-ENTONCES, SI-ENTONCES-SINO, SEGUN-CASO) permiten bifurcar la ejecución de un programa según las entradas provistas.'
      }),
      new Periodo({
        id: 'p-9-4',
        gradoId: 'grado-9',
        nombre: 'Periodo IV: Bucles y Arreglos',
        descripcion: 'Repetición controlada e introducción a estructuras de datos.',
        cuadroTeorico: 'La repetición eficiente de instrucciones es fundamental en computación. Los ciclos o bucles (MIENTRAS, PARA, REPETIR) automatizan tareas redundantes, y los arreglos (vectores) almacenan múltiples datos indexados de un mismo tipo.'
      }),

      // Grado 10
      new Periodo({
        id: 'p-10-1',
        gradoId: 'grado-10',
        nombre: 'Periodo I: HTML5 Semántico',
        descripcion: 'Estructuración del esqueleto de un sitio web moderno.',
        cuadroTeorico: 'HyperText Markup Language (HTML) define la estructura jerárquica de una página. El estándar HTML5 introduce etiquetas semánticas (<header>, <nav>, <main>, <article>, <footer>) que informan al navegador y motores de búsqueda acerca del rol del contenido.'
      }),
      new Periodo({
        id: 'p-10-2',
        gradoId: 'grado-10',
        nombre: 'Periodo II: Hojas de Estilo CSS3',
        descripcion: 'Diseño visual, colores y distribución responsive.',
        cuadroTeorico: 'Cascading Style Sheets (CSS) añade color, tipografía y diseño al HTML. Aprenderás a construir cuadrículas fluidas con Flexbox y CSS Grid, implementando Media Queries para que los sitios web se adapten perfectamente a dispositivos móviles y proyectores.'
      }),
      new Periodo({
        id: 'p-10-3',
        gradoId: 'grado-10',
        nombre: 'Periodo III: Lógica con JavaScript',
        descripcion: 'Adición de dinamismo y comportamiento al cliente web.',
        cuadroTeorico: 'JavaScript es el lenguaje que corre en el navegador para dar interactividad. Conocerás sus variables dinámicas, condicionales nativos, funciones y eventos que dotan a una página de vida propia frente a las interacciones del usuario.'
      }),
      new Periodo({
        id: 'p-10-4',
        gradoId: 'grado-10',
        nombre: 'Periodo IV: DOM y Formularios',
        descripcion: 'Manipulación de elementos en tiempo real y envío de datos.',
        cuadroTeorico: 'El Document Object Model (DOM) es la interfaz de programación para documentos web. Aprenderemos a capturar eventos de clicks, scroll o envíos de formulario para validar campos y reaccionar de forma inmediata sin recargar el navegador.'
      }),

      // Grado 11
      new Periodo({
        id: 'p-11-1',
        gradoId: 'grado-11',
        nombre: 'Periodo I: Bases de Datos Relacionales',
        descripcion: 'Almacenamiento estructurado, entidades y cardinalidad.',
        cuadroTeorico: 'Las bases de datos relacionales organizan la información en tablas lógicas interconectadas. Aprenderás a diseñar diagramas Entidad-Relación, normalizar bases de datos para evitar redundancia y comprender relaciones de 1-a-1, 1-a-N y N-a-N.'
      }),
      new Periodo({
        id: 'p-11-2',
        gradoId: 'grado-11',
        nombre: 'Periodo II: SQL y Backend Básico',
        descripcion: 'Consultas de datos y servidores con PHP o Node.js.',
        cuadroTeorico: 'Structured Query Language (SQL) es el lenguaje estándar para interactuar con bases de datos. Aprenderás sentencias SELECT, INSERT, UPDATE, DELETE y a conectar tu backend Laravel o PHP para responder solicitudes de forma dinámica.'
      }),
      new Periodo({
        id: 'p-11-3',
        gradoId: 'grado-11',
        nombre: 'Periodo III: APIs REST y JSON',
        descripcion: 'Intercambio estandarizado de información entre sistemas.',
        cuadroTeorico: 'Las APIs (Application Programming Interfaces) REST permiten que el frontend (React) y el backend (Laravel) se comuniquen sin importar el lenguaje. Utilizan el formato liviano JSON (JavaScript Object Notation) para estructurar datos transmitidos.'
      }),
      new Periodo({
        id: 'p-11-4',
        gradoId: 'grado-11',
        nombre: 'Periodo IV: Proyecto de Software',
        descripcion: 'Desarrollo de un CMS o aplicación web integrada.',
        cuadroTeorico: 'En este periodo final aplicarás todas tus competencias técnicas en un proyecto de software escolar. Diseñarás la base de datos, implementarás los controladores Laravel, la interfaz interactiva React y expondrás el resultado final.'
      })
    ];
  }

  async obtenerPeriodosPorGrado(gradoId) {
    return this.periodos.filter(p => p.gradoId === gradoId);
  }

  async obtenerPeriodoPorId(id) {
    return this.periodos.find(p => p.id === id) || null;
  }
}
