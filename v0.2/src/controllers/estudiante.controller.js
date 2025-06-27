const estudianteService = require('../services/estudiante.service');

// Controlador para Estudiante adaptado a IDs personalizados y relaciones muchos-a-muchos
exports.getEstudiantes = async function(req, res) {
  try {
    const estudiantes = await estudianteService.findAll();
    res.json(estudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEstudiante = async function(req, res) {
  try {
    const { cedula } = req.params;
    const estudiante = await estudianteService.getByCedula(cedula);
    if (!estudiante) return res.status(404).json({ error: 'No encontrado' });
    res.json(estudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEstudiante = async function(req, res) {
  try {
    const data = req.body;
    const nuevo = await estudianteService.create(data);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateEstudiante = async function(req, res) {
  try {
    const { cedula } = req.params;
    const data = req.body;
    const actualizado = await estudianteService.updateByCedula(cedula, data);
    if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEstudiante = async function(req, res) {
  try {
    const { cedula } = req.params;
    const eliminado = await estudianteService.removeByCedula(cedula);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
    res.json({ eliminado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMaterias = async function(req, res) {
  try {
    const { id_estudiante } = req.params;
    const materias = await estudianteService.getMaterias(id_estudiante);
    res.json(materias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.asignarMateria = async function(req, res) {
  try {
    const { id_estudiante } = req.params;
    const { codigo_materia } = req.body;
    const result = await estudianteService.asignarMateria(id_estudiante, codigo_materia);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.quitarMateria = async function(req, res) {
  try {
    const { id_estudiante, codigo_materia } = req.params;
    const result = await estudianteService.quitarMateria(id_estudiante, codigo_materia);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};