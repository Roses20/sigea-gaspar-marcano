const express = require('express');
const {
    getProfesores,
    getProfesor,
    createProfesor,
    updateProfesor,
    deleteProfesor
} = require('../controllers/profesor.controller');
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

router.get('/', authenticateToken, getProfesores); // Proteger la ruta
router.get('/:id', authenticateToken, getProfesor); // Proteger la ruta
router.post('/', [
    authenticateToken,
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').isString().notEmpty().withMessage('El apellido es obligatorio'),
    body('cedula').isString().notEmpty().withMessage('La cédula es obligatoria'),
    body('telefono').isString().notEmpty().withMessage('El teléfono es obligatorio'),
    body('direccion').optional().isString().withMessage('La dirección debe ser un texto'),
    body('materia').isString().notEmpty().withMessage('La materia es obligatoria'),
    validate
], createProfesor); // Proteger la ruta
router.put('/:id', [
    authenticateToken,
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
    body('apellido').optional().isString().withMessage('El apellido debe ser un texto'),
    body('cedula').optional().isString().withMessage('La cédula debe ser un texto'),
    body('telefono').optional().isString().withMessage('El teléfono debe ser un texto'),
    body('direccion').optional().isString().withMessage('La dirección debe ser un texto'),
    body('materia').optional().isString().withMessage('La materia debe ser un texto'),
    validate
], updateProfesor); // Proteger la ruta
router.delete('/:id', authenticateToken, deleteProfesor); // Proteger la ruta

module.exports = router;
