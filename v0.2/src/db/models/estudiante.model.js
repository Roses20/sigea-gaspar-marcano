const { Model, DataTypes } = require('sequelize');

class Estudiante extends Model {
  static associate(models) {
    // Relación con inscripciones
    Estudiante.hasMany(models.Inscripcion, {
      foreignKey: 'id_estudiante',
      as: 'inscripciones'
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'estudiantes',
      modelName: 'Estudiante',
      timestamps: false
    };
  }
}

const EstudianteSchema = {
  id_estudiante: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cedula_estudiante: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fecha_nacimiento: DataTypes.DATEONLY,
  genero: DataTypes.STRING(10),
  direccion: DataTypes.STRING(255),
  telefono: DataTypes.STRING(20),
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  fecha_ingreso: DataTypes.DATEONLY,
  estado: DataTypes.STRING(20)
};

module.exports = { Estudiante, EstudianteSchema };