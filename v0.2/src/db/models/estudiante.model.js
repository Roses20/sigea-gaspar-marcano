const { Model, DataTypes } = require('sequelize');

class Estudiante extends Model {
  static associate(models) {
    Estudiante.belongsToMany(models.Materia, {
      through: models.EstudianteMateria,
      foreignKey: 'id_estudiante',
      otherKey: 'codigo_materia'
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'estudiante',
      modelName: 'Estudiante',
      timestamps: false
    };
  }
}

const EstudianteSchema = {
  id_estudiante: {
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
  direccion: DataTypes.STRING(255),
  anio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  seccion: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
};

module.exports = { Estudiante, EstudianteSchema };