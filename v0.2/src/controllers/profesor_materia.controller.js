const ProfesorMateriaService = require('../services/profesor_materia.service');
const service = new ProfesorMateriaService();

const getProfesorMaterias = async (req, res, next) => {
    try {
        const profesorMaterias = await service.findAll();
        res.json(profesorMaterias);
    } catch (error) {
        next(error);
    }
};

const getProfesorMateria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const profesorMateria = await service.findOne(id);
        res.json(profesorMateria);
    } catch (error) {
        next(error);
    }
};

const createProfesorMateria = async (req, res, next) => {
    try {
        const data = req.body;
        const newProfesorMateria = await service.create(data);
        res.status(201).json(newProfesorMateria);
    } catch (error) {
        next(error);
    }
};

const updateProfesorMateria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const changes = req.body;
        const updatedProfesorMateria = await service.update(id, changes);
        res.json(updatedProfesorMateria);
    } catch (error) {
        next(error);
    }
};

const deleteProfesorMateria = async (req, res, next) => {
    try {
        const { id } = req.params;
        await service.delete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfesorMaterias,
    getProfesorMateria,
    createProfesorMateria,
    updateProfesorMateria,
    deleteProfesorMateria
};
