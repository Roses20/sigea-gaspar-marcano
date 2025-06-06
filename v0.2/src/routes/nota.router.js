const express = require('express');
const {
    getNotas,
    getNota,
    createNota,
    updateNota,
    deleteNota
} = require('../controllers/nota.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { body, param, validationResult } = require('express-validator');

const router = express.Router();

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

router.get('/', authenticateToken, getNotas); // Proteger la ruta
router.get('/:id', authenticateToken, getNota); // Proteger la ruta
router.post('/', [
    authenticateToken,
    body('estudianteId').isInt().notEmpty().withMessage('El ID del estudiante es obligatorio'),
    body('materiaId').isInt().notEmpty().withMessage('El ID de la materia es obligatorio'),
    body('profesorId').optional().isInt().withMessage('El ID del profesor debe ser un número entero'),
    body('periodo').isString().notEmpty().withMessage('El periodo es obligatorio'),
    body('valor').isFloat().notEmpty().withMessage('El valor de la nota debe ser un número'),
    validate
], createNota); // Proteger la ruta
router.put('/:id', [
    authenticateToken,
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('estudianteId').optional().isInt().withMessage('El ID del estudiante debe ser un número entero'),
    body('materiaId').optional().isInt().withMessage('El ID de la materia debe ser un número entero'),
    body('profesorId').optional().isInt().withMessage('El ID del profesor debe ser un número entero'),
    body('periodo').optional().isString().withMessage('El periodo debe ser un texto'),
    body('valor').optional().isFloat().withMessage('El valor de la nota debe ser un número'),
    validate
], updateNota); // Proteger la ruta
router.delete('/:id', authenticateToken, deleteNota); // Proteger la ruta

module.exports = router;
