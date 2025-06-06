const MateriaService = require('../services/materia.service');
const service = new MateriaService();

const getMaterias = async (req, res, next) => {
    try {
        const materias = await service.findAll();
        res.json(materias);
    } catch (error) {
        next(error);
    }
};

const getMateria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const materia = await service.findOne(id);
        res.json(materia);
    } catch (error) {
        next(error);
    }
};

const createMateria = async (req, res, next) => {
    try {
        const data = req.body;
        const newMateria = await service.create(data);
        res.status(201).json(newMateria);
    } catch (error) {
        next(error);
    }
};

const updateMateria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const changes = req.body;
        const updatedMateria = await service.update(id, changes);
        res.json(updatedMateria);
    } catch (error) {
        next(error);
    }
};

const deleteMateria = async (req, res, next) => {
    try {
        const { id } = req.params;
        await service.delete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMaterias,
    getMateria,
    createMateria,
    updateMateria,
    deleteMateria
};
