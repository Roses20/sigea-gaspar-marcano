const { models } = require('../libs/sequelize');

class ProfesorService {
    constructor() {}

    async create(data) {
        const newProfesor = await models.Profesor.create(data);
        return newProfesor;
    }

    async findAll() {
        const profesores = await models.Profesor.findAll();
        return profesores;
    }

    async findOne(id) {
        const profesor = await models.Profesor.findByPk(id);
        if (!profesor) {
            throw new Error('Profesor no encontrado');
        }
        return profesor;
    }

    async update(id, changes) {
        const profesor = await this.findOne(id);
        const updatedProfesor = await profesor.update(changes);
        return updatedProfesor;
    }

    async delete(id) {
        const profesor = await this.findOne(id);
        await profesor.destroy();
        return { id };
    }
}

module.exports = ProfesorService;
