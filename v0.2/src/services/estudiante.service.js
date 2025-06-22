const { Estudiante, Materia } = require('../db/models');

class EstudianteService {
  constructor() {}

  async create(data) {
    // Generar ID único para estudiante
    const last = await Estudiante.findOne({
      where: { id_estudiante: { [Estudiante.sequelize.Op.like]: 'ST%' } },
      order: [['id_estudiante', 'DESC']]
    });
    let num = 1;
    if (last && last.id_estudiante) {
      const match = last.id_estudiante.match(/\d+$/);
      if (match) num = parseInt(match[0], 10) + 1;
    }
    data.id_estudiante = `ST${String(num).padStart(3, '0')}`;
    return Estudiante.create(data);
  }

  async findAll() {
    return Estudiante.findAll();
  }

  async findOne(id_estudiante) {
    return Estudiante.findByPk(id_estudiante);
  }

  async update(id_estudiante, data) {
    const estudiante = await Estudiante.findByPk(id_estudiante);
    if (!estudiante) return null;
    await estudiante.update(data);
    return estudiante;
  }

  async delete(id_estudiante) {
    const estudiante = await Estudiante.findByPk(id_estudiante);
    if (!estudiante) return null;
    await estudiante.destroy();
    return true;
  }

  async getMaterias(id_estudiante) {
    const estudiante = await Estudiante.findByPk(id_estudiante);
    if (!estudiante) throw new Error('Estudiante no encontrado');
    return estudiante.getMaterias();
  }

  async asignarMateria(id_estudiante, codigo_materia) {
    const estudiante = await Estudiante.findByPk(id_estudiante);
    const materia = await Materia.findByPk(codigo_materia);
    if (!estudiante || !materia) throw new Error('No encontrado');
    await estudiante.addMateria(materia);
    return { message: 'Materia asignada' };
  }

  async quitarMateria(id_estudiante, codigo_materia) {
    const estudiante = await Estudiante.findByPk(id_estudiante);
    const materia = await Materia.findByPk(codigo_materia);
    if (!estudiante || !materia) throw new Error('No encontrado');
    await estudiante.removeMateria(materia);
    return { message: 'Materia removida' };
  }
}

module.exports = EstudianteService;