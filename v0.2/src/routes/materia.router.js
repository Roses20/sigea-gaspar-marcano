const express = require('express');
const {
    getMaterias,
    getMateria,
    createMateria,
    updateMateria,
    deleteMateria
} = require('../controllers/materia.controller');
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

router.get('/', authenticateToken, getMaterias); // Proteger la ruta
router.get('/:id', authenticateToken, getMateria); // Proteger la ruta
router.post('/', [
    authenticateToken,
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
    body('descripcion').optional().isString().withMessage('La descripción debe ser un texto'),
    validate
], createMateria); // Proteger la ruta
router.put('/:id', [
    authenticateToken,
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
    body('descripcion').optional().isString().withMessage('La descripción debe ser un texto'),
    validate
], updateMateria); // Proteger la ruta
router.delete('/:id', authenticateToken, deleteMateria); // Proteger la ruta

module.exports = router;
