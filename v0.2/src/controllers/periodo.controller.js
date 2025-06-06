const PeriodoService = require('../services/periodo.service');
const service = new PeriodoService();

const getPeriodos = async (req, res, next) => {
    try {
        const periodos = await service.findAll();
        res.json(periodos);
    } catch (error) {
        next(error);
    }
};

const getPeriodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const periodo = await service.findOne(id);
        res.json(periodo);
    } catch (error) {
        next(error);
    }
};

const createPeriodo = async (req, res, next) => {
    try {
        const data = req.body;
        const newPeriodo = await service.create(data);
        res.status(201).json(newPeriodo);
    } catch (error) {
        next(error);
    }
};

const updatePeriodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const changes = req.body;
        const updatedPeriodo = await service.update(id, changes);
        res.json(updatedPeriodo);
    } catch (error) {
        next(error);
    }
};

const deletePeriodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        await service.delete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPeriodos,
    getPeriodo,
    createPeriodo,
    updatePeriodo,
    deletePeriodo
};
