const { Usuario, Sequelize } = require('../db/models');

class UsuarioService {
    constructor() {}

    async create(data) {
        // Generar ID único según el rol
        let prefix = '';
        if (data.rol === 'estudiante') prefix = 'ST';
        else if (data.rol === 'profesor') prefix = 'PR';
        else prefix = 'AD';
        // Buscar el último ID existente con ese prefijo
        const last = await Usuario.findOne({
            where: { id: { [Sequelize.Op.like]: `${prefix}%` } },
            order: [['id', 'DESC']]
        });
        let num = 1;
        if (last && last.id) {
            const match = last.id.match(/\d+$/);
            if (match) num = parseInt(match[0], 10) + 1;
        }
        const id = `${prefix}${String(num).padStart(3, '0')}`;
        data.id = id;
        const newUsuario = await Usuario.create(data);
        return newUsuario;
    }

    async findAll() {
        const usuarios = await Usuario.findAll();
        return usuarios;
    }

    async findOne(id) {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        return usuario;
    }

    async update(id, changes) {
        const usuario = await this.findOne(id);
        const updatedUsuario = await usuario.update(changes);
        return updatedUsuario;
    }

    async delete(id) {
        const usuario = await this.findOne(id);
        await usuario.destroy();
        return { id };
    }
}

module.exports = UsuarioService;
