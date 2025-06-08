const express = require('express');
const {
    getEstudiantes,
    getEstudiante,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante
} = require('../controllers/estudiante.controller');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');
const { body, param, validationResult } = require('express-validator');
const { Estudiante, Usuario } = require('../models');
const { hashPassword } = require('../utils/hash');

const router = express.Router();

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

router.use(authenticateToken);

// Solo admin puede crear estudiantes
router.post('/', checkRole(['admin']), [
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

// Admin y profesor pueden ver todos los estudiantes
router.get('/', checkRole(['admin', 'profesor']), getEstudiantes); // Proteger la ruta

// Estudiante solo puede ver sus propios datos
router.get('/:id', checkRole(['admin', 'profesor', 'estudiante']), async (req, res, next) => {
    if (req.user.rol === 'estudiante' && req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    getEstudiante(req, res, next);
}); // Proteger la ruta

// Solo admin y profesor pueden modificar datos de estudiantes
router.put('/:id', checkRole(['admin', 'profesor']), [
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

// Solo admin puede eliminar estudiantes
router.delete('/:id', checkRole(['admin']), deleteEstudiante); // Proteger la ruta

// Estudiante puede ver sus datos personales
router.get('/perfil', checkRole(['estudiante']), async (req, res, next) => {
    try {
        const estudiante = await Estudiante.findByPk(req.user.id);
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        res.json(estudiante);
    } catch (error) {
        next(error);
    }
});

// Estudiante puede modificar sus datos de perfil
router.put('/perfil', checkRole(['estudiante']), async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const estudiante = await Usuario.findByPk(req.user.id);
        if (!estudiante) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (username) estudiante.username = username;
        if (password) estudiante.password = await hashPassword(password);

        await estudiante.save();
        res.json({ message: 'Perfil actualizado correctamente.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
