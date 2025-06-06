const { models } = require('../libs/sequelize');

class MateriaService {
    constructor() {}

    async create(data) {
        const newMateria = await models.Materia.create(data);
        return newMateria;
    }

    async findAll() {
        const materias = await models.Materia.findAll();
        return materias;
    }

    async findOne(id) {
        const materia = await models.Materia.findByPk(id);
        if (!materia) {
            throw new Error('Materia no encontrada');
        }
        return materia;
    }

    async update(id, changes) {
        const materia = await this.findOne(id);
        const updatedMateria = await materia.update(changes);
        return updatedMateria;
    }

    async delete(id) {
        const materia = await this.findOne(id);
        await materia.destroy();
        return { id };
    }
}

module.exports = MateriaService;
