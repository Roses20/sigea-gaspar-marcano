const { Nota, ProfesorMateria } = require('../db/models');

class NotaService {
    constructor() {}

    async create(data) {
        const newNota = await Nota.create(data);
        return newNota;
    }

    async findAll() {
        const notas = await Nota.findAll();
        return notas;
    }

    async findOne(id) {
        const nota = await Nota.findByPk(id);
        if (!nota) {
            throw new Error('Nota no encontrada');
        }
        return nota;
    }

    async update(id, changes, user) {
        const nota = await this.findOne(id);
        // Si el usuario es profesor, validar que la materia le pertenece
        if (user && user.rol === 'profesor') {
            const asignacion = await ProfesorMateria.findOne({
                where: {
                    id_profesor: user.id,
                    codigo_materia: changes.codigo_materia || nota.codigo_materia
                }
            });
            if (!asignacion) {
                const err = new Error('No puede modificar notas de materias que no le pertenecen');
                err.status = 403;
                throw err;
            }
        }
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
