const { ProfesorMateria } = require('../db/models');

class ProfesorMateriaService {
    constructor() {}

    async create(data) {
        const newProfesorMateria = await ProfesorMateria.create(data);
        return newProfesorMateria;
    }

    async findAll() {
        const profesorMaterias = await ProfesorMateria.findAll();
        return profesorMaterias;
    }

    async findOne(id) {
        const profesorMateria = await ProfesorMateria.findByPk(id);
        if (!profesorMateria) {
            throw new Error('Asignación no encontrada');
        }
        return profesorMateria;
    }

    async update(id, changes) {
        const profesorMateria = await this.findOne(id);
        const updatedProfesorMateria = await profesorMateria.update(changes);
        return updatedProfesorMateria;
    }

    async delete(id) {
        const profesorMateria = await this.findOne(id);
        await profesorMateria.destroy();
        return { id };
    }
}

module.exports = ProfesorMateriaService;
