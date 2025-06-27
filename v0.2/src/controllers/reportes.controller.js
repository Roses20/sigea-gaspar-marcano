// Controlador de reportes para endpoints adicionales
const { models } = require('../libs/sequelize');
const reportesService = require('../services/reportes.service');

// Reporte de asistencia (ejemplo: cantidad de estudiantes presentes/ausentes por día)
async function getReporteAsistencia(req, res) {
  try {
    const data = await reportesService.obtenerAsistencia();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el reporte de asistencia' });
  }
}

// Reporte de rendimiento académico (ejemplo: promedio general de notas por materia)
async function getReporteRendimiento(req, res) {
  try {
    const data = await reportesService.obtenerRendimiento();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el reporte de rendimiento' });
  }
}

module.exports = {
  getReporteAsistencia,
  getReporteRendimiento
};
