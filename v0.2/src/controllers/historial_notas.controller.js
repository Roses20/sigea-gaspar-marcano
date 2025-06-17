const historialNotasService = require('../services/historial_notas.service');

async function getHistorialNotas(req, res, next) {
    try {
        const historial = await historialNotasService.findAllHistorialNotas(req.query);
        res.json(historial);
    } catch (error) {
        next(error);
    }
}

async function createHistorialNota(req, res, next) {
    try {
        const nuevaNota = await historialNotasService.createHistorialNota(req.body);
        res.status(201).json(nuevaNota);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getHistorialNotas,
    createHistorialNota
};
