const { models } = require('../libs/sequelize');

class PeriodoService {
    constructor() {}

    async create(data) {
        const newPeriodo = await models.Periodo.create(data);
        return newPeriodo;
    }

    async findAll() {
        const periodos = await models.Periodo.findAll();
        return periodos;
    }

    async findOne(id) {
        const periodo = await models.Periodo.findByPk(id);
        if (!periodo) {
            throw new Error('Periodo no encontrado');
        }
        return periodo;
    }

    async update(id, changes) {
        const periodo = await this.findOne(id);
        const updatedPeriodo = await periodo.update(changes);
        return updatedPeriodo;
    }

    async delete(id) {
        const periodo = await this.findOne(id);
        await periodo.destroy();
        return { id };
    }
}

module.exports = PeriodoService;
