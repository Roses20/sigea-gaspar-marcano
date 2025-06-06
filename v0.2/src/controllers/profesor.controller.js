const ProfesorService = require('../services/profesor.service');
const service = new ProfesorService();

const getProfesores = async (req, res, next) => {
    try {
        const profesores = await service.findAll();
        res.json(profesores);
    } catch (error) {
        next(error);
    }
};

const getProfesor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const profesor = await service.findOne(id);
        res.json(profesor);
    } catch (error) {
        next(error);
    }
};

const createProfesor = async (req, res, next) => {
    try {
        const data = req.body;
        const newProfesor = await service.create(data);
        res.status(201).json(newProfesor);
    } catch (error) {
        next(error);
    }
};

const updateProfesor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const changes = req.body;
        const updatedProfesor = await service.update(id, changes);
        res.json(updatedProfesor);
    } catch (error) {
        next(error);
    }
};

const deleteProfesor = async (req, res, next) => {
    try {
        const { id } = req.params;
        await service.delete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfesores,
    getProfesor,
    createProfesor,
    updateProfesor,
    deleteProfesor
};
