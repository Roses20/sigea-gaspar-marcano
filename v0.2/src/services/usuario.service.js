const { models } = require('../libs/sequelize');

class UsuarioService {
    constructor() {}

    async create(data) {
        // Generar ID único según el rol
        let prefix = '';
        if (data.rol === 'estudiante') prefix = 'ST';
        else if (data.rol === 'profesor') prefix = 'PR';
        else prefix = 'AD';
        // Buscar el último ID existente con ese prefijo
        const last = await models.Usuario.findOne({
            where: { id: { [models.Sequelize.Op.like]: `${prefix}%` } },
            order: [['id', 'DESC']]
        });
        let num = 1;
        if (last && last.id) {
            const match = last.id.match(/\d+$/);
            if (match) num = parseInt(match[0], 10) + 1;
        }
        const id = `${prefix}${String(num).padStart(3, '0')}`;
        data.id = id;
        const newUsuario = await models.Usuario.create(data);
        return newUsuario;
    }

    async findAll() {
        const usuarios = await models.Usuario.findAll();
        return usuarios;
    }

    async findOne(id) {
        const usuario = await models.Usuario.findByPk(id);
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
