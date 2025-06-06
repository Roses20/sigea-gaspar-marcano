const { models } = require('../libs/sequelize');

class EstudianteService {
    constructor() {}

    async create(data) {
        const newEstudiante = await models.Estudiante.create(data);
        return newEstudiante;
    }

    async findAll() {
        const estudiantes = await models.Estudiante.findAll();
        return estudiantes;
    }

    async findOne(id) {
        const estudiante = await models.Estudiante.findByPk(id);
        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }
        return estudiante;
    }

    async update(id, changes) {
        const estudiante = await this.findOne(id);
        const updatedEstudiante = await estudiante.update(changes);
        return updatedEstudiante;
    }

    async delete(id) {
        const estudiante = await this.findOne(id);
        await estudiante.destroy();
        return { id };
    }
}

module.exports = EstudianteService;