const { HistorialNotas, Materia, Periodo } = require('../db/models');

async function findAllHistorialNotas(query = {}) {
    return await HistorialNotas.findAll({
        where: query,
        include: ['estudiante', 'materia', 'profesor', 'periodo']
    });
}

async function findHistorialNotasByEstudiante(estudianteId, sortBy, order) {
    // Definir ordenamiento
    let orderArr = [];
    if (sortBy === 'materia') {
        orderArr = [[{ model: Materia, as: 'materia' }, 'nombre', order === 'desc' ? 'DESC' : 'ASC']];
    } else if (sortBy === 'nota') {
        orderArr = [['nota', order === 'desc' ? 'DESC' : 'ASC']];
    }
    return await HistorialNotas.findAll({
        where: { estudianteId },
        include: [
            { model: Materia, as: 'materia', attributes: ['nombre'] },
            { model: Periodo, as: 'periodo', attributes: ['nombre'] }
        ],
        order: orderArr
    });
}

async function createHistorialNota(data) {
    return await HistorialNotas.create(data);
}

module.exports = {
    findAllHistorialNotas,
    findHistorialNotasByEstudiante,
    createHistorialNota
};
