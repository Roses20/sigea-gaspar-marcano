const express = require('express');
const {
    getProfesorMaterias,
    getProfesorMateria,
    createProfesorMateria,
    updateProfesorMateria,
    deleteProfesorMateria
} = require('../controllers/profesor_materia.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { body, param, validationResult } = require('express-validator');
const { ProfesorMateria, Profesor, Materia } = require('../db/models');

const router = express.Router();

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

router.get('/', authenticateToken, getProfesorMaterias); // Proteger la ruta
router.get('/:id', authenticateToken, getProfesorMateria); // Proteger la ruta
router.post('/', [
    authenticateToken,
    body('profesorId').isInt().notEmpty().withMessage('El ID del profesor es obligatorio'),
    body('materiaId').isInt().notEmpty().withMessage('El ID de la materia es obligatorio'),
    validate
], createProfesorMateria); // Proteger la ruta
router.put('/:id', [
    authenticateToken,
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('profesorId').optional().isInt().withMessage('El ID del profesor debe ser un número entero'),
    body('materiaId').optional().isInt().withMessage('El ID de la materia debe ser un número entero'),
    validate
], updateProfesorMateria); // Proteger la ruta
router.delete('/:id', authenticateToken, deleteProfesorMateria); // Proteger la ruta

module.exports = router;
