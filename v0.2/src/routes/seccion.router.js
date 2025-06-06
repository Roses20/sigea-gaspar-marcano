const express = require('express');
const {
    getSecciones,
    getSeccion,
    createSeccion,
    updateSeccion,
    deleteSeccion
} = require('../controllers/seccion.controller');
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

router.get('/', authenticateToken, getSecciones); // Proteger la ruta
router.get('/:id', authenticateToken, getSeccion); // Proteger la ruta
router.post('/', [
    authenticateToken,
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
    body('anio').isString().notEmpty().withMessage('El año es obligatorio'),
    body('tutorId').optional().isInt().withMessage('El ID del tutor debe ser un número entero'),
    validate
], createSeccion); // Proteger la ruta
router.put('/:id', [
    authenticateToken,
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
    body('anio').optional().isString().withMessage('El año debe ser un texto'),
    body('tutorId').optional().isInt().withMessage('El ID del tutor debe ser un número entero'),
    validate
], updateSeccion); // Proteger la ruta
router.delete('/:id', authenticateToken, deleteSeccion); // Proteger la ruta

module.exports = router;
