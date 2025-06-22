// Servicio para Profesor adaptado a IDs personalizados y relaciones muchos-a-muchos
const { Profesor, Materia } = require('../db/models');

module.exports = {
  async getAll() {
    return Profesor.findAll();
  },
  async getById(id_profesor) {
    return Profesor.findByPk(id_profesor);
  },
  async create(data) {
    // Generar ID único para profesor
    const last = await Profesor.findOne({
      where: { id_profesor: { [Profesor.sequelize.Op.like]: 'PR%' } },
      order: [['id_profesor', 'DESC']]
    });
    let num = 1;
    if (last && last.id_profesor) {
      const match = last.id_profesor.match(/\d+$/);
      if (match) num = parseInt(match[0], 10) + 1;
    }
    data.id_profesor = `PR${String(num).padStart(3, '0')}`;
    return Profesor.create(data);
  },
  async update(id_profesor, data) {
    const profesor = await Profesor.findByPk(id_profesor);
    if (!profesor) return null;
    await profesor.update(data);
    return profesor;
  },
  async remove(id_profesor) {
    const profesor = await Profesor.findByPk(id_profesor);
    if (!profesor) return null;
    await profesor.destroy();
    return true;
  },
  async getMaterias(id_profesor) {
    const profesor = await Profesor.findByPk(id_profesor);
    if (!profesor) throw new Error('Profesor no encontrado');
    return profesor.getMaterias();
  },
  async asignarMateria(id_profesor, codigo_materia) {
    const profesor = await Profesor.findByPk(id_profesor);
    const materia = await Materia.findByPk(codigo_materia);
    if (!profesor || !materia) throw new Error('No encontrado');
    await profesor.addMateria(materia);
    return { message: 'Materia asignada' };
  },
  async quitarMateria(id_profesor, codigo_materia) {
    const profesor = await Profesor.findByPk(id_profesor);
    const materia = await Materia.findByPk(codigo_materia);
    if (!profesor || !materia) throw new Error('No encontrado');
    await profesor.removeMateria(materia);
    return { message: 'Materia removida' };
  }
};
