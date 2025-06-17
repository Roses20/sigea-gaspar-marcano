const express = require('express');
const { getHistorialNotas, createHistorialNota } = require('../controllers/historial_notas.controller');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

// Obtener historial de notas
router.get('/', checkRole(['admin']), getHistorialNotas);

// Crear un registro en el historial de notas
router.post('/', checkRole(['admin']), createHistorialNota);

module.exports = router;
