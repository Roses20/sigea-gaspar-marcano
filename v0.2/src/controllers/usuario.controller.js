const usuarioService = require('../services/usuario.service');

module.exports = {
  async getAll(req, res) {
    try {
      const items = await usuarioService.findAll();
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const item = await usuarioService.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'No encontrado' });
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const nuevo = await usuarioService.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const updated = await usuarioService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      await usuarioService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
};
