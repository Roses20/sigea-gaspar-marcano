const { Model, DataTypes } = require('sequelize');

class EstudianteMateria extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'estudiante_materia',
      modelName: 'EstudianteMateria',
      timestamps: false
    };
  }
}

const EstudianteMateriaSchema = {
  id_estudiante: {
    type: DataTypes.STRING(10),
    primaryKey: true
  },
  codigo_materia: {
    type: DataTypes.STRING(20),
    primaryKey: true
  }
};

module.exports = { EstudianteMateria, EstudianteMateriaSchema };
