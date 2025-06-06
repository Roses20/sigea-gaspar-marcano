const express = require('express');
const {
    getEstudiantes,
    getEstudiante,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante
} = require('../controllers/estudiante.controller');
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

router.get('/', authenticateToken, getEstudiantes); // Proteger la ruta
router.get('/:id', authenticateToken, getEstudiante); // Proteger la ruta
router.post('/', [
    authenticateToken,
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').isString().notEmpty().withMessage('El apellido es obligatorio'),
    body('cedula').isString().notEmpty().withMessage('La cédula es obligatoria'),
    body('telefono').isString().notEmpty().withMessage('El teléfono es obligatorio'),
    body('fecha_nacimiento').isDate().withMessage('La fecha de nacimiento debe ser válida'),
    body('direccion').optional().isString().withMessage('La dirección debe ser un texto'),
    body('anio').isString().notEmpty().withMessage('El año es obligatorio'),
    body('seccion').isString().notEmpty().withMessage('La sección es obligatoria'),
    validate
], createEstudiante); // Proteger la ruta
router.put('/:id', [
    authenticateToken,
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
    body('apellido').optional().isString().withMessage('El apellido debe ser un texto'),
    body('cedula').optional().isString().withMessage('La cédula debe ser un texto'),
    body('telefono').optional().isString().withMessage('El teléfono debe ser un texto'),
    body('fecha_nacimiento').optional().isDate().withMessage('La fecha de nacimiento debe ser válida'),
    body('direccion').optional().isString().withMessage('La dirección debe ser un texto'),
    body('anio').optional().isString().withMessage('El año debe ser un texto'),
    body('seccion').optional().isString().withMessage('La sección debe ser un texto'),
    validate
], updateEstudiante); // Proteger la ruta
router.delete('/:id', authenticateToken, deleteEstudiante); // Proteger la ruta

module.exports = router;
