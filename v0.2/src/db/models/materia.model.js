const { Model, DataTypes } = require('sequelize');

class Materia extends Model {
  static associate(models) {
    Materia.belongsToMany(models.Profesor, {
      through: models.ProfesorMateria,
      foreignKey: 'codigo_materia',
      otherKey: 'id_profesor'
    });
    Materia.belongsToMany(models.Estudiante, {
      through: models.EstudianteMateria,
      foreignKey: 'codigo_materia',
      otherKey: 'id_estudiante'
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'materia',
      modelName: 'Materia',
      timestamps: false
    };
  }
}

const MateriaSchema = {
  codigo_materia: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
};

module.exports = { Materia, MateriaSchema };