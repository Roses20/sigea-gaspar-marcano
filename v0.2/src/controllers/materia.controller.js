// Controlador para Materia adaptado a claves personalizadas y relaciones muchos-a-muchos
const materiaService = require('../services/materia.service');

exports.getMaterias = async function(req, res) {
  try {
    const materias = await materiaService.findAll();
    res.json(materias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMateria = async function(req, res) {
  try {
    const { codigo_materia } = req.params;
    const materia = await materiaService.getById(codigo_materia);
    if (!materia) return res.status(404).json({ error: 'No encontrado' });
    res.json(materia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMateria = async function(req, res) {
  try {
    const data = req.body;
    const nuevo = await materiaService.create(data);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMateria = async function(req, res) {
  try {
    const { codigo_materia } = req.params;
    const data = req.body;
    const actualizado = await materiaService.update(codigo_materia, data);
    if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMateria = async function(req, res) {
  try {
    const { codigo_materia } = req.params;
    const eliminado = await materiaService.remove(codigo_materia);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEstudiantes = async function(req, res) {
  try {
    const { codigo_materia } = req.params;
    const estudiantes = await materiaService.getEstudiantes(codigo_materia);
    res.json(estudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfesores = async function(req, res) {
  try {
    const { codigo_materia } = req.params;
    const profesores = await materiaService.getProfesores(codigo_materia);
    res.json(profesores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
