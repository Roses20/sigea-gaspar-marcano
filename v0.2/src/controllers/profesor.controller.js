const profesorService = require('../services/profesor.service');

// Controlador para Profesor adaptado a IDs personalizados y relaciones muchos-a-muchos
exports.getProfesores = async function(req, res) {
  try {
    const profesores = await profesorService.findAll();
    res.json(profesores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfesor = async function(req, res) {
  try {
    const { cedula } = req.params;
    const profesor = await profesorService.getByCedula(cedula);
    if (!profesor) return res.status(404).json({ error: 'No encontrado' });
    res.json(profesor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProfesor = async function(req, res) {
  try {
    const data = req.body;
    const nuevo = await profesorService.create(data);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProfesor = async function(req, res) {
  try {
    const { cedula } = req.params;
    const data = req.body;
    const actualizado = await profesorService.updateByCedula(cedula, data);
    if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProfesor = async function(req, res) {
  try {
    const { cedula } = req.params;
    const eliminado = await profesorService.removeByCedula(cedula);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
    res.json({ eliminado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMaterias = async function(req, res) {
  try {
    const { id_profesor } = req.params;
    const materias = await profesorService.getMaterias(id_profesor);
    res.json(materias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.asignarMateria = async function(req, res) {
  try {
    const { id_profesor } = req.params;
    const { codigo_materia } = req.body;
    const result = await profesorService.asignarMateria(id_profesor, codigo_materia);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.quitarMateria = async function(req, res) {
  try {
    const { id_profesor, codigo_materia } = req.params;
    const result = await profesorService.quitarMateria(id_profesor, codigo_materia);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
