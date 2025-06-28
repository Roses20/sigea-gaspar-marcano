const { Usuario, Estudiante, Profesor } = require('../db/models');
const bcrypt = require('bcryptjs');

module.exports = {
  findAll: async () => {
    // Incluye datos de estudiante o profesor si corresponde
    return Usuario.findAll({
      include: [
        { model: Estudiante, as: 'estudiante', required: false },
        { model: Profesor, as: 'profesor', required: false }
      ]
    });
  },
  findById: (id) => Usuario.findByPk(id),
  create: async (data) => {
    if (data.password) {
      data.password_hash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }
    return Usuario.create(data);
  },
  update: async (id, data) => {
    if (data.password) {
      data.password_hash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }
    return Usuario.update(data, { where: { id_usuario: id } });
  },
  delete: async (id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    // Elimina el estudiante o profesor relacionado si existe
    if (usuario.rol === 'estudiante' && usuario.id_persona) {
      await Estudiante.destroy({ where: { id_estudiante: usuario.id_persona } });
    }
    if (usuario.rol === 'profesor' && usuario.id_persona) {
      await Profesor.destroy({ where: { id_profesor: usuario.id_persona } });
    }
    return Usuario.destroy({ where: { id_usuario: id } });
  }
};
