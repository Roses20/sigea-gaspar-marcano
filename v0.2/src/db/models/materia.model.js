const { Model, DataTypes } = require('sequelize');

class Materia extends Model {
  static associate(models) {
    // Relación con cursos
    Materia.hasMany(models.Curso, {
      foreignKey: 'id_materia',
      as: 'cursos'
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'materias',
      modelName: 'Materia',
      timestamps: false
    };
  }
}

const MateriaSchema = {
  id_materia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: DataTypes.STRING(255),
  nivel: DataTypes.STRING(20)
};

module.exports = { Materia, MateriaSchema };