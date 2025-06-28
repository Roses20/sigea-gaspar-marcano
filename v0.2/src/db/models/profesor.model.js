const { Model, DataTypes } = require('sequelize');

class Profesor extends Model {
  static associate(models) {
    // Relación con cursos
    Profesor.hasMany(models.Curso, {
      foreignKey: 'id_profesor',
      as: 'cursos'
    });
  }
}

const ProfesorSchema = {
  id_profesor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cedula_profesor: {
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
  especialidad: DataTypes.STRING(100),
  telefono: DataTypes.STRING(20),
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  fecha_contratacion: DataTypes.DATEONLY,
  estado: DataTypes.STRING(20)
};

// Esta función debe llamarse en tu setupModels
function setupProfesor(sequelize) {
  Profesor.init(ProfesorSchema, {
    sequelize,
    tableName: 'profesores',
    modelName: 'Profesor',
    timestamps: false
  });
  return Profesor;
}

module.exports = { Profesor, ProfesorSchema, setupProfesor};