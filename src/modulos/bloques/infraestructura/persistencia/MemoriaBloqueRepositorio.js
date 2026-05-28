import BloqueRepositorio from '../../dominio/contratos/BloqueRepositorio';
import Bloque from '../../dominio/entidades/Bloque';

/**
 * Implementación en memoria del repositorio de Bloques de Contenido.
 */
export default class MemoriaBloqueRepositorio extends BloqueRepositorio {
  constructor() {
    super();
    this.bloques = {
      // Bloques para Tema 1: Concepto de Algoritmo (t-9-1-1)
      't-9-1-1': [
        new Bloque({
          id: 'b-1',
          temaId: 't-9-1-1',
          tipo: 'TITULO',
          contenido: 'Fundamentos de Algoritmia'
        }),
        new Bloque({
          id: 'b-2',
          temaId: 't-9-1-1',
          tipo: 'TEXTO',
          contenido: 'Bienvenidos al primer tema del curso. Aquí aprenderás las bases lógicas que sustentan toda la programación moderna. Antes de escribir código en un lenguaje sofisticado, debes dominar cómo estructurar los pasos lógicos para resolver un problema.'
        }),
        new Bloque({
          id: 'b-3',
          temaId: 't-9-1-1',
          tipo: 'SEPARADOR',
          contenido: ''
        }),
        new Bloque({
          id: 'b-4',
          temaId: 't-9-1-1',
          tipo: 'SUBTITULO',
          contenido: '¿Qué es exactamente un Algoritmo?'
        }),
        new Bloque({
          id: 'b-5',
          temaId: 't-9-1-1',
          tipo: 'TEXTO',
          contenido: 'En informática, un algoritmo es una secuencia precisa, ordenada y finita de instrucciones lógicas que resuelven un problema o realizan una tarea. Piensa en él como una receta de cocina: sigues los pasos uno a uno para obtener un pastel. Si cambias el orden de los pasos, o te saltas uno, el resultado final no será el esperado.'
        }),
        new Bloque({
          id: 'b-6',
          temaId: 't-9-1-1',
          tipo: 'LISTA',
          contenido: 'Propiedades fundamentales de todo algoritmo:',
          propiedades: {
            ordenada: true,
            elementos: [
              'Preciso: Debe indicar el orden exacto de realización de cada paso.',
              'Definido: Si se sigue el algoritmo dos veces con los mismos datos, se debe obtener el mismo resultado.',
              'Finito: Debe terminar en algún momento; no puede ejecutarse infinitamente.',
              'Entrada: Recibe datos iniciales para procesar.',
              'Salida: Produce uno o más resultados finales.'
            ]
          }
        }),
        new Bloque({
          id: 'b-7',
          temaId: 't-9-1-1',
          tipo: 'SEPARADOR',
          contenido: ''
        }),
        new Bloque({
          id: 'b-8',
          temaId: 't-9-1-1',
          tipo: 'SUBTITULO',
          contenido: 'Ejemplo Práctico: Algoritmo para preparar Café'
        }),
        new Bloque({
          id: 'b-9',
          temaId: 't-9-1-1',
          tipo: 'IMAGEN',
          contenido: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
          propiedades: {
            leyenda: 'Imagen representativa: Preparar café es un algoritmo cotidiano común en la vida real.'
          }
        }),
        new Bloque({
          id: 'b-10',
          temaId: 't-9-1-1',
          tipo: 'TABLA',
          contenido: '',
          propiedades: {
            cabeceras: ['Paso', 'Acción o Instrucción', 'Estado del Recipiente'],
            filas: [
              ['1', 'Verter agua caliente en la taza.', 'Agua caliente en taza'],
              ['2', 'Agregar una cucharada de café soluble.', 'Agua con café disuelto'],
              ['3', '¿Desea azúcar? Si es sí, agregar cucharada.', 'Café preparado (dulce)'],
              ['4', '¿Desea leche? Si es sí, verter un chorro.', 'Café preparado con leche'],
              ['5', 'Revolver con la cuchara y servir.', 'Listo para consumir']
            ]
          }
        }),
        new Bloque({
          id: 'b-11',
          temaId: 't-9-1-1',
          tipo: 'SEPARADOR',
          contenido: ''
        }),
        new Bloque({
          id: 'b-12',
          temaId: 't-9-1-1',
          tipo: 'SUBTITULO',
          contenido: 'Simbología de Diagramas de Flujo'
        }),
        new Bloque({
          id: 'b-13',
          temaId: 't-9-1-1',
          tipo: 'GALERIA',
          contenido: 'Representación visual de los bloques de diagramación',
          propiedades: {
            imagenes: [
              {
                url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
                leyenda: 'Óvalo: Inicio y Fin del Algoritmo.'
              },
              {
                url: 'https://images.unsplash.com/photo-1618005198143-e5283b519e7f?w=400',
                leyenda: 'Rectángulo: Operación o Proceso matemático.'
              },
              {
                url: 'https://images.unsplash.com/photo-1618005154378-fc9648b3947e?w=400',
                leyenda: 'Rombo: Decisión o Bifurcación del Flujo.'
              }
            ]
          }
        }),
        new Bloque({
          id: 'b-14',
          temaId: 't-9-1-1',
          tipo: 'VIDEO',
          contenido: 'Video Explicativo de Algoritmos',
          propiedades: {
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            titulo: 'Visualización Animada: Algoritmos en 60 Segundos'
          }
        }),
        new Bloque({
          id: 'b-15',
          temaId: 't-9-1-1',
          tipo: 'PDF',
          contenido: 'Recurso descargable para lectura complementaria',
          propiedades: {
            archivoNombre: 'guia_practica_de_algoritmia_escolar.pdf',
            tamano: '840 KB',
            url: '#'
          }
        }),
        new Bloque({
          id: 'b-16',
          temaId: 't-9-1-1',
          tipo: 'LINK',
          contenido: 'Recursos externos recomendados',
          propiedades: {
            url: 'https://es.wikipedia.org/wiki/Algoritmo',
            texto: 'Explorar definición detallada en Wikipedia'
          }
        }),
        new Bloque({
          id: 'b-17',
          temaId: 't-9-1-1',
          tipo: 'SEPARADOR',
          contenido: ''
        }),
        new Bloque({
          id: 'b-18',
          temaId: 't-9-1-1',
          tipo: 'SUBTITULO',
          contenido: 'Ejemplo de Implementación en Código'
        }),
        new Bloque({
          id: 'b-19',
          temaId: 't-9-1-1',
          tipo: 'TEXTO',
          contenido: 'Una vez diseñado el algoritmo, lo traducimos a un lenguaje. Mira este sencillo programa en Javascript que calcula la suma de dos números provistos por el usuario:'
        }),
        new Bloque({
          id: 'b-20',
          temaId: 't-9-1-1',
          tipo: 'CODIGO',
          contenido: 'javascript',
          propiedades: {
            codigo: `// Algoritmo: Sumar Dos Números
function calcularSuma(numeroA, numeroB) {
  // Paso 1: Recibir las entradas
  console.log("Número A:", numeroA);
  console.log("Número B:", numeroB);
  
  // Paso 2: Ejecutar el procesamiento de suma
  const resultado = numeroA + numeroB;
  
  // Paso 3: Retornar la salida
  return resultado;
}

const resultadoFinal = calcularSuma(15, 25);
console.log("Resultado del Algoritmo:", resultadoFinal);`
          }
        }),
        new Bloque({
          id: 'b-21',
          temaId: 't-9-1-1',
          tipo: 'SEPARADOR',
          contenido: ''
        }),
        new Bloque({
          id: 'b-22',
          temaId: 't-9-1-1',
          tipo: 'SUBTITULO',
          contenido: 'Actividades de Evaluación Interactiva'
        }),
        new Bloque({
          id: 'b-23',
          temaId: 't-9-1-1',
          tipo: 'ACTIVIDAD',
          contenido: 'Desafío Escrito: Algoritmo de Higiene Cotidiana',
          propiedades: {
            instruccion: 'Escribe de forma detallada (mínimo 5 pasos) el algoritmo secuencial para lavarse los dientes en la mañana. Incluye pasos lógicos como la aplicación de pasta y el enjuague de la boca.'
          }
        }),
        new Bloque({
          id: 'b-24',
          temaId: 't-9-1-1',
          tipo: 'QUIZ',
          contenido: 'Pregunta de Selección Múltiple',
          propiedades: {
            pregunta: '¿Cuál de las siguientes afirmaciones describe mejor el concepto de "Finitud" en un algoritmo?',
            opciones: [
              'El algoritmo debe retornar el mismo resultado siempre.',
              'El algoritmo debe terminar después de un número determinado de pasos.',
              'El algoritmo debe ejecutarse en el menor tiempo posible.',
              'El algoritmo debe escribirse en español.'
            ],
            respuestaCorrecta: 1,
            explicacion: 'La finitud significa que el algoritmo tiene un fin. Un proceso infinito no es considerado un algoritmo en ciencias de la computación ya que consumiría memoria infinitamente.'
          }
        }),
        new Bloque({
          id: 'b-25',
          temaId: 't-9-1-1',
          tipo: 'MINIJUEGO',
          contenido: 'Ordena el Algoritmo',
          propiedades: {
            titulo: 'Organizador de Pasos: Intercambiar Valores de Variables',
            instrucciones: 'Supón que tienes dos vasos: A (lleno de jugo) y B (lleno de leche). Quieres pasar el jugo a B y la leche a A usando un vaso auxiliar VACÍO (AUX). Ordena los pasos correctamente:',
            pasosCorrectos: [
              'Verter el contenido de A (jugo) en AUX.',
              'Verter el contenido de B (leche) en A.',
              'Verter el contenido de AUX (jugo) en B.'
            ],
            pasosDesordenados: [
              'Verter el contenido de B (leche) en A.',
              'Verter el contenido de AUX (jugo) en B.',
              'Verter el contenido de A (jugo) en AUX.'
            ]
          }
        })
      ],

      // Bloques para Tema 2: Variables y Tipos de Datos (t-9-1-2)
      't-9-1-2': [
        new Bloque({
          id: 'b-201',
          temaId: 't-9-1-2',
          tipo: 'TITULO',
          contenido: 'Variables y Constantes'
        }),
        new Bloque({
          id: 'b-202',
          temaId: 't-9-1-2',
          tipo: 'TEXTO',
          contenido: 'Una variable es un espacio de memoria reservado en la computadora para almacenar un dato que puede cambiar durante la ejecución del programa. Imagínala como una caja con una etiqueta adhesiva (nombre) donde guardas cosas.'
        }),
        new Bloque({
          id: 'b-203',
          temaId: 't-9-1-2',
          tipo: 'CODIGO',
          contenido: 'javascript',
          propiedades: {
            codigo: `// Declaración de Variables
let nombreEstudiante = "Junior Arias"; // Puede cambiar
const pi = 3.14159; // Es constante y no puede cambiar

nombreEstudiante = "Junior Arias Modificado"; // Válido
// pi = 3.14; // ¡ERROR! No se puede reasignar una constante.`
          }
        }),
        new Bloque({
          id: 'b-204',
          temaId: 't-9-1-2',
          tipo: 'QUIZ',
          contenido: '¿Qué es una Constante?',
          propiedades: {
            pregunta: '¿Cuál es la diferencia principal entre una variable y una constante?',
            opciones: [
              'Las variables son para números y las constantes para textos.',
              'El valor de una variable puede cambiar, mientras que el de una constante es fijo.',
              'Las constantes ocupan más memoria que las variables.',
              'Las variables solo funcionan en JavaScript y las constantes en PHP.'
            ],
            respuestaCorrecta: 1,
            explicacion: 'Una constante mantiene su valor fijo e inalterable durante toda la ejecución del programa. Las variables son contenedores para datos dinámicos.'
          }
        })
      ]
    };
  }

  async obtenerBloquesPorTema(temaId) {
    // Si no existen bloques registrados, proveemos un esqueleto por defecto
    return this.bloques[temaId] || [
      new Bloque({
        id: `b-default-1-${temaId}`,
        temaId: temaId,
        tipo: 'TITULO',
        contenido: 'Tema en Construcción'
      }),
      new Bloque({
        id: `b-default-2-${temaId}`,
        temaId: temaId,
        tipo: 'TEXTO',
        contenido: 'Esta sección del currículo se encuentra en proceso de redacción y carga en el CMS. Pronto se añadirán los bloques explicativos, códigos y actividades interactivas.'
      })
    ];
  }
}
