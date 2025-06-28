const { Inscripcion } = require('../db/models');

module.exports = {
  findAll: () => Inscripcion.findAll(),
  findById: (id) => Inscripcion.findByPk(id),
  create: (data) => Inscripcion.create(data),
  update: (id, data) => Inscripcion.update(data, { where: { id_inscripcion: id } }),
  delete: (id) => Inscripcion.destroy({ where: { id_inscripcion: id } })
};
