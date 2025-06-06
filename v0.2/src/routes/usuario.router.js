const express = require('express');
const {
    getUsuarios,
    getUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario
} = require('../controllers/usuario.controller');
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

router.get('/', authenticateToken, getUsuarios); // Proteger la ruta
router.get('/:id', authenticateToken, getUsuario); // Proteger la ruta
router.post('/', [
    body('username').isString().notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol').isIn(['admin', 'profesor', 'estudiante']).withMessage('El rol es inválido'),
    validate
], createUsuario); // Proteger la ruta
router.put('/:id', [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('username').optional().isString().withMessage('El nombre de usuario debe ser un texto'),
    body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol').optional().isIn(['admin', 'profesor', 'estudiante']).withMessage('El rol es inválido'),
    validate
], updateUsuario); // Proteger la ruta
router.delete('/:id', authenticateToken, deleteUsuario); // Proteger la ruta

module.exports = router;
