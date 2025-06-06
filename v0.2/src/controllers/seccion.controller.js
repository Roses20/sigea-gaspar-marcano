const SeccionService = require('../services/seccion.service');
const service = new SeccionService();

const getSecciones = async (req, res, next) => {
    try {
        const secciones = await service.findAll();
        res.json(secciones);
    } catch (error) {
        next(error);
    }
};

const getSeccion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const seccion = await service.findOne(id);
        res.json(seccion);
    } catch (error) {
        next(error);
    }
};

const createSeccion = async (req, res, next) => {
    try {
        const data = req.body;
        const newSeccion = await service.create(data);
        res.status(201).json(newSeccion);
    } catch (error) {
        next(error);
    }
};

const updateSeccion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const changes = req.body;
        const updatedSeccion = await service.update(id, changes);
        res.json(updatedSeccion);
    } catch (error) {
        next(error);
    }
};

const deleteSeccion = async (req, res, next) => {
    try {
        const { id } = req.params;
        await service.delete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSecciones,
    getSeccion,
    createSeccion,
    updateSeccion,
    deleteSeccion
};
