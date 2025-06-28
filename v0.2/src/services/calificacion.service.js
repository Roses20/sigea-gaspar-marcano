const { Calificacion } = require('../db/models');

module.exports = {
  findAll: () => Calificacion.findAll(),
  findById: (id) => Calificacion.findByPk(id),
  create: (data) => Calificacion.create(data),
  update: (id, data) => Calificacion.update(data, { where: { id_calificacion: id } }),
  delete: (id) => Calificacion.destroy({ where: { id_calificacion: id } })
};
