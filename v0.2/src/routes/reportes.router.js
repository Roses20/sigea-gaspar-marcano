const express = require('express');
const { models } = require('../libs/sequelize');
const router = express.Router();

// GET /api/reportes/usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const profesores = await models.Profesor.count();
    const estudiantes = await models.Estudiante.count();
    res.json({ usuarios: { profesores, estudiantes } });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los conteos' });
  }
});

module.exports = router;
