import TemaRepositorio from '../../dominio/contratos/TemaRepositorio';
import Tema from '../../dominio/entidades/Tema';

/**
 * Implementación en memoria del repositorio de Temas.
 */
export default class MemoriaTemaRepositorio extends TemaRepositorio {
  constructor() {
    super();
    this.temas = [
      // Temas para Grado 9 - Periodo 1
      new Tema({
        id: 't-9-1-1',
        periodoId: 'p-9-1',
        nombre: 'Concepto de Algoritmo',
        descripcion: 'Definición, características esenciales y estructura general de un algoritmo.',
        orden: 1
      }),
      new Tema({
        id: 't-9-1-2',
        periodoId: 'p-9-1',
        nombre: 'Variables y Tipos de Datos',
        descripcion: 'Qué son las variables, constantes y los tipos de datos fundamentales.',
        orden: 2
      }),
      new Tema({
        id: 't-9-1-3',
        periodoId: 'p-9-1',
        nombre: 'Operadores Matemáticos y Lógicos',
        descripcion: 'Uso de operadores aritméticos, relacionales y lógicos en lógica computacional.',
        orden: 3
      }),

      // Temas para Grado 9 - Periodo 2
      new Tema({
        id: 't-9-2-1',
        periodoId: 'p-9-2',
        nombre: 'Fundamentos de Pseudocódigo',
        descripcion: 'Sintaxis básica y comandos principales en pseudocódigo.',
        orden: 1
      }),
      new Tema({
        id: 't-9-2-2',
        periodoId: 'p-9-2',
        nombre: 'Diagramas de Flujo Básicos',
        descripcion: 'Simbología estándar de diagramas de flujo y su interpretación gráfica.',
        orden: 2
      }),

      // Temas para Grado 10 - Periodo 1
      new Tema({
        id: 't-10-1-1',
        periodoId: 'p-10-1',
        nombre: 'Introducción a la Web e HTML5',
        descripcion: 'Cómo funciona la web, el rol de los navegadores y el marcado HTML básico.',
        orden: 1
      }),
      new Tema({
        id: 't-10-1-2',
        periodoId: 'p-10-1',
        nombre: 'Etiquetas Semánticas de Estructura',
        descripcion: 'Uso correcto de main, article, section, header y footer para accesibilidad y SEO.',
        orden: 2
      }),

      // Temas para Grado 10 - Periodo 2
      new Tema({
        id: 't-10-2-1',
        periodoId: 'p-10-2',
        nombre: 'Flexbox: Diseño Unidimensional',
        descripcion: 'Distribución flexible de elementos en filas o columnas mediante CSS.',
        orden: 1
      }),
      
      // Temas para Grado 11 - Periodo 1
      new Tema({
        id: 't-11-1-1',
        periodoId: 'p-11-1',
        nombre: 'Modelo Entidad-Relación (MER)',
        descripcion: 'Diseño conceptual de bases de datos utilizando diagramas ER.',
        orden: 1
      }),
      new Tema({
        id: 't-11-1-2',
        periodoId: 'p-11-1',
        nombre: 'Reglas de Normalización',
        descripcion: 'Cómo normalizar tablas (1FN, 2FN, 3FN) para evitar duplicidad.',
        orden: 2
      })
    ];
  }

  async obtenerTemasPorPeriodo(periodoId) {
    return this.temas
      .filter(t => t.periodoId === periodoId)
      .sort((a, b) => a.orden - b.orden);
  }

  async obtenerTemaPorId(id) {
    return this.temas.find(t => t.id === id) || null;
  }
}
