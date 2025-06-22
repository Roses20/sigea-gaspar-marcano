const express = require('express');
const router = express.Router();
const { models } = require('../libs/sequelize');

// GET /api/dashboard-counts
router.get('/counts', async (req, res) => {
  try {
    const estudiantes = await models.Estudiante.count();
    const profesores = await models.Profesor.count();
    res.json({ estudiantes, profesores });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los conteos' });
  }
});

module.exports = router;
