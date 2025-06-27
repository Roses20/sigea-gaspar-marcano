const { Seccion } = require('../db/models');

class SeccionService {
    constructor() {}

    async create(data) {
        const newSeccion = await Seccion.create(data);
        return newSeccion;
    }

    async findAll() {
        const secciones = await Seccion.findAll();
        return secciones;
    }

    async findOne(id) {
        const seccion = await Seccion.findByPk(id);
        if (!seccion) {
            throw new Error('Sección no encontrada');
        }
        return seccion;
    }

    async update(id, changes) {
        const seccion = await this.findOne(id);
        const updatedSeccion = await seccion.update(changes);
        return updatedSeccion;
    }

    async delete(id) {
        const seccion = await this.findOne(id);
        await seccion.destroy();
        return { id };
    }
}

module.exports = SeccionService;
