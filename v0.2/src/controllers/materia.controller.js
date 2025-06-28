const { Materia } = require('../db/models');

module.exports = {
  async getAll(req, res) {
    const items = await Materia.findAll();
    // Forzar que cada objeto tenga id_materia como propiedad
    const result = items.map(m => ({
      id_materia: m.id_materia,
      codigo: m.codigo,
      nombre: m.nombre,
      descripcion: m.descripcion,
      nivel: m.nivel
    }));
    res.json(result);
  },
  async getById(req, res) {
    const item = await Materia.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  },
  async create(req, res) {
    const nuevo = await Materia.create(req.body);
    res.status(201).json(nuevo);
  },
  async update(req, res) {
    const item = await Materia.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    await item.update(req.body);
    res.json(item);
  },
  async delete(req, res) {
    try {
      const { Curso, Inscripcion, Calificacion } = require('../db/models');
      const item = await Materia.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'No encontrado' });
      // Buscar cursos relacionados
      const cursos = await Curso.findAll({ where: { id_materia: item.id_materia || item.id } });
      for (const curso of cursos) {
        // Buscar inscripciones relacionadas a cada curso
        const inscripciones = await Inscripcion.findAll({ where: { id_curso: curso.id_curso || curso.id } });
        for (const insc of inscripciones) {
          // Eliminar calificaciones relacionadas a cada inscripción
          await Calificacion.destroy({ where: { id_inscripcion: insc.id_inscripcion || insc.id } });
          await insc.destroy();
        }
        await curso.destroy();
      }
      await item.destroy();
      res.status(204).send();
    } catch (err) {
      console.error('Error al eliminar materia y dependencias:', err);
      res.status(500).json({ error: 'No se pudo eliminar la materia. Verifica que no existan dependencias huérfanas.' });
    }
  }
};
