const { Model, DataTypes } = require('sequelize');

class Profesor extends Model {
  static associate(models) {
    Profesor.belongsToMany(models.Materia, {
      through: models.ProfesorMateria,
      foreignKey: 'id_profesor',
      otherKey: 'codigo_materia'
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'profesor',
      modelName: 'Profesor',
      timestamps: false
    };
  }
}

const ProfesorSchema = {
  id_profesor: {
    type: DataTypes.STRING(10),
    primaryKey: true
  },
  cedula: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  telefono: DataTypes.STRING(20),
  direccion: DataTypes.STRING(255)
};

module.exports = { Profesor, ProfesorSchema };