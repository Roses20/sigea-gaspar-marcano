const express = require('express');
const { getHistorialNotas, createHistorialNota, getHistorialNotasByEstudiante } = require('../controllers/historial_notas.controller');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

// Obtener historial de notas de todos (admin)
router.get('/', checkRole(['admin']), getHistorialNotas);

// Obtener historial de notas de un estudiante específico, con ordenamiento
router.get('/:estudianteId', checkRole(['admin']), getHistorialNotasByEstudiante);

// Crear un registro en el historial de notas
router.post('/', checkRole(['admin']), createHistorialNota);

module.exports = router;
