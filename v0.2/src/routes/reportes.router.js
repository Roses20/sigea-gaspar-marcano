const express = require('express');
const { models } = require('../libs/sequelize');
const { getReporteAsistencia, getReporteRendimiento } = require('../controllers/reportes.controller');
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

// GET /api/reportes/asistencia
router.get('/asistencia', getReporteAsistencia);

// GET /api/reportes/rendimiento
router.get('/rendimiento', getReporteRendimiento);

module.exports = router;
