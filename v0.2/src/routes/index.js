const express = require('express');

const estudianteRoutes = require('./estudiante.router');
const profesorRoutes = require('./profesor.router');
const materiaRoutes = require('./materia.router');
const notaRoutes = require('./nota.router');
const periodoRoutes = require('./periodo.router');
const usuarioRoutes = require('./usuario.router');
const seccionRoutes = require('./seccion.router');
const profesorMateriaRoutes = require('./profesor_materia.router');

const router = express.Router();
// Definir las rutas para cada recurso
router.use('/estudiantes', estudianteRoutes);
router.use('/profesores', profesorRoutes);
router.use('/materias', materiaRoutes);
router.use('/notas', notaRoutes);
router.use('/periodos', periodoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/secciones', seccionRoutes);
router.use('/profesor-materias', profesorMateriaRoutes);

module.exports = router;