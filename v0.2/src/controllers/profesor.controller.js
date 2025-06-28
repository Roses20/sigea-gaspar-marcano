const { Profesor } = require('../db/models');

module.exports = {
  async getAll(req, res) {
    try {
      const items = await Profesor.findAll();
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const item = await Profesor.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'No encontrado' });
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const nuevo = await Profesor.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const item = await Profesor.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'No encontrado' });
      await item.update(req.body);
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const item = await Profesor.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'No encontrado' });
      await item.destroy();
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
  async count(req, res) {
    try {
      const total = await Profesor.count();
      res.json({ total });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
};
