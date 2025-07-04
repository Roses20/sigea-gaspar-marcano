const express = require('express');
const ctrl = require('../controllers/estudiante.controller');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');
const { body, param, validationResult } = require('express-validator');
const { Estudiante, Usuario } = require('../db/models');
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

// Contar estudiantes (ruta específica primero)
router.get('/count', ctrl.count);

// Solo admin puede crear estudiantes
router.post('/', [
    authenticateToken,
    checkRole(['admin']),
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
    body('cedula').isString().notEmpty().withMessage('La cédula es obligatoria'),
    body('telefono').isString().notEmpty().withMessage('El teléfono es obligatorio'),
    body('fecha_nacimiento').optional().isString().withMessage('La fecha de nacimiento debe ser un texto'),
    body('direccion').optional().isString().withMessage('La dirección debe ser un texto'),
    body('anio').optional().isString().withMessage('El año es obligatorio'),
    body('seccion').optional().isString().withMessage('La sección es obligatoria'),
    validate
], ctrl.createEstudiante); // Proteger la ruta

// Admin y profesor pueden ver todos los estudiantes
router.get('/', checkRole(['admin', 'profesor']), ctrl.getEstudiantes); // Proteger la ruta

// Estudiante solo puede ver sus propios datos
router.get('/:cedula', checkRole(['admin', 'profesor', 'estudiante']), async (req, res, next) => {
    if (req.user.rol === 'estudiante' && req.user.id !== parseInt(req.params.cedula)) {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    ctrl.getEstudiante(req, res, next);
}); // Proteger la ruta

// Solo admin y profesor pueden modificar datos de estudiantes
router.put('/:cedula', checkRole(['admin', 'profesor']), [
    param('cedula').isString().withMessage('La cédula debe ser un texto'),
    body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
    body('apellido').optional().isString().withMessage('El apellido debe ser un texto'),
    body('telefono').optional().isString().withMessage('El teléfono debe ser un texto'),
    body('fecha_nacimiento').optional().isDate().withMessage('La fecha de nacimiento debe ser válida'),
    body('direccion').optional().isString().withMessage('La dirección debe ser un texto'),
    body('anio').optional().isString().withMessage('El año debe ser un texto'),
    body('seccion').optional().isString().withMessage('La sección debe ser un texto'),
    validate
], ctrl.updateEstudiante); // Proteger la ruta

// Solo admin puede eliminar estudiantes
router.delete('/:cedula', checkRole(['admin']), ctrl.deleteEstudiante); // Proteger la ruta

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
        const { nombreCompleto, email, telefono, ano, seccion, direccion, fechaNacimiento } = req.body;
        const usuario = await Usuario.findByPk(req.user.id);
        const estudiante = await Estudiante.findByPk(req.user.id);
        if (!usuario || !estudiante) {
            return res.status(404).json({ message: 'Usuario o estudiante no encontrado' });
        }
        // Actualizar usuario
        if (email) usuario.email = email;
        if (nombreCompleto) usuario.nombre = nombreCompleto;
        await usuario.save();
        // Actualizar estudiante
        if (telefono) estudiante.telefono = telefono;
        if (ano) estudiante.anio = ano;
        if (seccion) estudiante.seccion = seccion;
        if (direccion) estudiante.direccion = direccion;
        if (fechaNacimiento) estudiante.fecha_nacimiento = fechaNacimiento;
        await estudiante.save();
        res.json({ message: 'Perfil actualizado correctamente.' });
    } catch (error) {
        next(error);
    }
});

// Materias del estudiante
router.get('/:cedula/materias', checkRole(['admin', 'profesor', 'estudiante']), ctrl.getMaterias);
router.post('/:cedula/materias', checkRole(['admin', 'profesor']), ctrl.asignarMateria);
router.delete('/:cedula/materias/:codigo_materia', checkRole(['admin', 'profesor']), ctrl.quitarMateria);

module.exports = router;
