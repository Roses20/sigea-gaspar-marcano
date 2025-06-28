const { Estudiante } = require('../db/models');

// Controlador para Estudiante adaptado a IDs personalizados y relaciones muchos-a-muchos
exports.getEstudiantes = async function(req, res) {
  try {
    const estudiantes = await Estudiante.findAll();
    res.json(estudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEstudiante = async function(req, res) {
  try {
    const estudiante = await Estudiante.findByPk(req.params.id);
    if (!estudiante) return res.status(404).json({ error: 'No encontrado' });
    res.json(estudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEstudiante = async function(req, res) {
  try {
    const nuevo = await Estudiante.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateEstudiante = async function(req, res) {
  try {
    const estudiante = await Estudiante.findByPk(req.params.id);
    if (!estudiante) return res.status(404).json({ error: 'No encontrado' });
    await estudiante.update(req.body);
    res.json(estudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEstudiante = async function(req, res) {
  try {
    const estudiante = await Estudiante.findByPk(req.params.id);
    if (!estudiante) return res.status(404).json({ error: 'No encontrado' });
    await estudiante.destroy();
    res.status(204).send();
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

exports.count = async (req, res) => {
  try {
    const total = await Estudiante.count();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};