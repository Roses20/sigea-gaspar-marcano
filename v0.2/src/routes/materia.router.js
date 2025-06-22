const express = require('express');
const router = express.Router();
const {
  getMaterias,
  getMateria,
  createMateria,
  updateMateria,
  deleteMateria,
  getEstudiantes,
  getProfesores
} = require('../controllers/materia.controller');

router.get('/', getMaterias);
router.get('/:codigo_materia', getMateria);
router.post('/', createMateria);
router.put('/:codigo_materia', updateMateria);
router.delete('/:codigo_materia', deleteMateria);

// Relaciones
router.get('/:codigo_materia/estudiantes', getEstudiantes);
router.get('/:codigo_materia/profesores', getProfesores);

module.exports = router;
