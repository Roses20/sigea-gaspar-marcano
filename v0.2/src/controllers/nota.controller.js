const NotaService = require('../services/nota.service');
const service = new NotaService();

const getNotas = async (req, res, next) => {
    try {
        const notas = await service.findAll();
        res.json(notas);
    } catch (error) {
        next(error);
    }
};

const getNota = async (req, res, next) => {
    try {
        const { id } = req.params;
        const nota = await service.findOne(id);
        res.json(nota);
    } catch (error) {
        next(error);
    }
};

const createNota = async (req, res, next) => {
    try {
        const data = req.body;
        const newNota = await service.create(data);
        res.status(201).json(newNota);
    } catch (error) {
        next(error);
    }
};

const updateNota = async (req, res, next) => {
    try {
        const { id } = req.params;
        const changes = req.body;
        const updatedNota = await service.update(id, changes, req.user);
        res.json(updatedNota);
    } catch (error) {
        next(error);
    }
};

const deleteNota = async (req, res, next) => {
    try {
        const { id } = req.params;
        await service.delete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotas,
    getNota,
    createNota,
    updateNota,
    deleteNota
};
