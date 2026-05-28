import GradoRepositorio from '../../dominio/contratos/GradoRepositorio';
import Grado from '../../dominio/entidades/Grado';

/**
 * Implementación en memoria del repositorio de Grados.
 */
export default class MemoriaGradoRepositorio extends GradoRepositorio {
  constructor() {
    super();
    this.grados = [
      new Grado({
        id: 'grado-9',
        nombre: 'Grado 9°: Algoritmia',
        descripcion: 'Pensamiento lógico, estructuras de control básicas y secuenciales para resolver problemas.',
        icono: 'Cpu'
      }),
      new Grado({
        id: 'grado-10',
        nombre: 'Grado 10°: Desarrollo Web',
        descripcion: 'Maquetación web semántica con HTML, diseño adaptativo con CSS y lógica dinámica con JS.',
        icono: 'Monitor'
      }),
      new Grado({
        id: 'grado-11',
        nombre: 'Grado 11°: Backend & APIs',
        descripcion: 'Diseño de bases de datos relacionales, construcción de servidores y consumo de APIs.',
        icono: 'Terminal'
      })
    ];
  }

  async obtenerGrados() {
    return this.grados;
  }

  async obtenerGradoPorId(id) {
    return this.grados.find(g => g.id === id) || null;
  }
}
