const { models } = require('../libs/sequelize');

class NotaService {
    constructor() {}

    async create(data) {
        const newNota = await models.Nota.create(data);
        return newNota;
    }

    async findAll() {
        const notas = await models.Nota.findAll();
        return notas;
    }

    async findOne(id) {
        const nota = await models.Nota.findByPk(id);
        if (!nota) {
            throw new Error('Nota no encontrada');
        }
        return nota;
    }

    async update(id, changes) {
        const nota = await this.findOne(id);
        const updatedNota = await nota.update(changes);
        return updatedNota;
    }

    async delete(id) {
        const nota = await this.findOne(id);
        await nota.destroy();
        return { id };
    }
}

module.exports = NotaService;
