const express = require('express');
const {
    getPeriodos,
    getPeriodo,
    createPeriodo,
    updatePeriodo,
    deletePeriodo
} = require('../controllers/periodo.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { body, param, validationResult } = require('express-validator');
const { Periodo } = require('../db/models');

const router = express.Router();

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

router.get('/', authenticateToken, getPeriodos); // Proteger la ruta
router.get('/:id', authenticateToken, getPeriodo); // Proteger la ruta
router.post('/', [
    authenticateToken,
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
    body('fecha_inicio').isDate().notEmpty().withMessage('La fecha de inicio debe ser válida'),
    body('fecha_fin').isDate().notEmpty().withMessage('La fecha de fin debe ser válida'),
    validate
], createPeriodo); // Proteger la ruta
router.put('/:id', [
    authenticateToken,
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
    body('fecha_inicio').optional().isDate().withMessage('La fecha de inicio debe ser válida'),
    body('fecha_fin').optional().isDate().withMessage('La fecha de fin debe ser válida'),
    validate
], updatePeriodo); // Proteger la ruta
router.delete('/:id', authenticateToken, deletePeriodo); // Proteger la ruta

module.exports = router;
