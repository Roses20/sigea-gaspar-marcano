const express = require('express');
const {
    getNotas,
    getNota,
    createNota,
    updateNota,
    deleteNota
} = require('../controllers/nota.controller');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');
const { body, param, validationResult } = require('express-validator');
const { Seccion, Estudiante, Nota, Materia, Profesor } = require('../models');

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

// Profesor puede añadir notas de estudiantes asignados
router.post('/', checkRole(['profesor']), async (req, res, next) => {
    try {
        const { anio, notas } = req.body;

        // Validar que los estudiantes estén asignados al profesor
        const estudiantesAsignados = await Seccion.findAll({
            where: { anio, tutorId: req.user.id },
            include: [{ model: Estudiante, as: 'estudiantes' }]
        });

        const estudiantesIds = estudiantesAsignados.map(est => est.id);
        const notasValidas = notas.every(nota => estudiantesIds.includes(nota.estudianteId));

        if (!notasValidas) {
            return res.status(403).json({ message: 'Algunos estudiantes no están asignados a usted.' });
        }

        // Insertar las notas
        await Nota.bulkCreate(notas);
        res.json({ message: 'Notas añadidas correctamente.' });
    } catch (error) {
        next(error);
    }
});

// Estudiante puede ver sus propias notas en un año específico
router.get('/', checkRole(['estudiante']), async (req, res, next) => {
    try {
        const { anio } = req.query;

        // Filtrar notas por estudiante y año
        const notas = await Nota.findAll({
            where: { estudianteId: req.user.id, anio },
            include: [
                { model: Materia, as: 'materia' },
                { model: Profesor, as: 'profesor' }
            ]
        });

        res.json(notas);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
