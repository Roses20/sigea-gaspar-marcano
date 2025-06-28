const express = require('express');
const ctrl = require('../controllers/profesor.controller');
const router = express.Router();

// Primero las rutas específicas
router.get('/count', ctrl.count);
// Luego las rutas con parámetros
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
