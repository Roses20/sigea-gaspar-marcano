const { HistorialNotas } = require('../db/models');

async function findAllHistorialNotas(query = {}) {
    return await HistorialNotas.findAll({
        where: query,
        include: ['estudiante', 'materia', 'profesor', 'periodo']
    });
}

async function createHistorialNota(data) {
    return await HistorialNotas.create(data);
}

module.exports = {
    findAllHistorialNotas,
    createHistorialNota
};
