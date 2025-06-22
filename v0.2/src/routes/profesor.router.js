const express = require('express');
const {
    getProfesores,
    getProfesor,
    createProfesor,
    updateProfesor,
    deleteProfesor,
    getMaterias,
    asignarMateria,
    quitarMateria
} = require('../controllers/profesor.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { body, param, validationResult } = require('express-validator');
const { checkRole } = require('../middleware/role.middleware');
const { Seccion, Estudiante, Nota, Periodo } = require('../db/models');
const { Op } = require('sequelize');

const router = express.Router();

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

router.get('/', authenticateToken, getProfesores); // Proteger la ruta
router.get('/:id_profesor', authenticateToken, getProfesor); // Proteger la ruta
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
router.put('/:id_profesor', [
    authenticateToken,
    param('id_profesor').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
    body('apellido').optional().isString().withMessage('El apellido debe ser un texto'),
    body('cedula').optional().isString().withMessage('La cédula debe ser un texto'),
    body('telefono').optional().isString().withMessage('El teléfono debe ser un texto'),
    body('direccion').optional().isString().withMessage('La dirección debe ser un texto'),
    body('materia').optional().isString().withMessage('La materia debe ser un texto'),
    validate
], updateProfesor); // Proteger la ruta
router.delete('/:id_profesor', authenticateToken, deleteProfesor); // Proteger la ruta

// Materias del profesor
router.get('/:id_profesor/materias', authenticateToken, getMaterias); // Proteger la ruta
router.post('/:id_profesor/materias', [
    authenticateToken,
    body('codigo_materia').isString().notEmpty().withMessage('El código de la materia es obligatorio'),
    validate
], asignarMateria); // Proteger la ruta
router.delete('/:id_profesor/materias/:codigo_materia', authenticateToken, quitarMateria); // Proteger la ruta

// Profesor puede ver la lista de estudiantes asignados
router.get('/estudiantes', checkRole(['profesor']), async (req, res, next) => {
    try {
        const estudiantesAsignados = await Seccion.findAll({
            where: { tutorId: req.user.id },
            include: [{ model: Estudiante, as: 'estudiantes' }]
        });

        res.json(estudiantesAsignados);
    } catch (error) {
        next(error);
    }
});

// Profesor puede modificar la nota de estudiantes asignados
router.put('/notas', checkRole(['profesor']), async (req, res, next) => {
    try {
        const { estudianteId, materiaId, nota } = req.body;

        // Validar que el estudiante está asignado al profesor
        const estudianteAsignado = await Seccion.findOne({
            where: { tutorId: req.user.id },
            include: [{ model: Estudiante, as: 'estudiantes', where: { id: estudianteId } }]
        });

        if (!estudianteAsignado) {
            return res.status(403).json({ message: 'El estudiante no está asignado a usted.' });
        }

        // Validar que la nota pertenece al periodo escolar en curso
        const periodoActual = await Periodo.findOne({ where: { fecha_fin: { [Op.gte]: new Date() } } });
        if (!periodoActual) {
            return res.status(400).json({ message: 'No se pueden modificar notas de periodos pasados.' });
        }

        const notaExistente = await Nota.findOne({ where: { estudianteId, materiaId, periodoId: periodoActual.id } });
        if (!notaExistente) {
            return res.status(404).json({ message: 'Nota no encontrada.' });
        }

        notaExistente.nota = nota;
        await notaExistente.save();

        res.json({ message: 'Nota actualizada correctamente.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
