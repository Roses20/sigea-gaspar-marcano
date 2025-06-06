const EstudianteService = require('../services/estudiante.service');
const service = new EstudianteService();

const getEstudiantes = async (req, res, next) => {
    try {
        const estudiantes = await service.findAll();
        res.json(estudiantes);
    } catch (error) {
        next(error);
    }
};

const getEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params;
        const estudiante = await service.findOne(id);
        res.json(estudiante);
    } catch (error) {
        next(error);
    }
};

const createEstudiante = async (req, res, next) => {
    try {
        const data = req.body;
        const newEstudiante = await service.create(data);
        res.status(201).json(newEstudiante);
    } catch (error) {
        next(error);
    }
};

const updateEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params;
        const changes = req.body;
        const updatedEstudiante = await service.update(id, changes);
        res.json(updatedEstudiante);
    } catch (error) {
        next(error);
    }
};

const deleteEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params;
        await service.delete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEstudiantes,
    getEstudiante,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante
};