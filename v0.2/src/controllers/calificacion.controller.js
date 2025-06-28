const { Calificacion } = require('../db/models');

module.exports = {
  async getAll(req, res) {
    const items = await Calificacion.findAll();
    res.json(items);
  },
  async getById(req, res) {
    const item = await Calificacion.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  },
  async create(req, res) {
    const nuevo = await Calificacion.create(req.body);
    res.status(201).json(nuevo);
  },
  async update(req, res) {
    const item = await Calificacion.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    await item.update(req.body);
    res.json(item);
  },
  async delete(req, res) {
    const item = await Calificacion.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    await item.destroy();
    res.status(204).send();
  }
};
