// Servicio para Materia adaptado a claves personalizadas y relaciones muchos-a-muchos
const { Materia, Estudiante, Profesor } = require('../db/models');

module.exports = {
  async findAll() {
    return Materia.findAll();
  },
  async getById(codigo_materia) {
    return Materia.findByPk(codigo_materia);
  },
  async create(data) {
    return Materia.create(data);
  },
  async update(codigo_materia, data) {
    const materia = await Materia.findByPk(codigo_materia);
    if (!materia) return null;
    await materia.update(data);
    return materia;
  },
  async remove(codigo_materia) {
    const materia = await Materia.findByPk(codigo_materia);
    if (!materia) return null;
    await materia.destroy();
    return true;
  },
  async getEstudiantes(codigo_materia) {
    const materia = await Materia.findByPk(codigo_materia);
    if (!materia) throw new Error('Materia no encontrada');
    return materia.getEstudiantes();
  },
  async getProfesores(codigo_materia) {
    const materia = await Materia.findByPk(codigo_materia);
    if (!materia) throw new Error('Materia no encontrada');
    return materia.getProfesores();
  }
};
