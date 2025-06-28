const { Curso } = require('../db/models');

module.exports = {
  findAll: () => Curso.findAll(),
  findById: (id) => Curso.findByPk(id),
  create: (data) => Curso.create(data),
  update: (id, data) => Curso.update(data, { where: { id_curso: id } }),
  delete: (id) => Curso.destroy({ where: { id_curso: id } })
};
