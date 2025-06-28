const { Model, DataTypes } = require('sequelize');

class Curso extends Model {
  static associate(models) {
    Curso.belongsTo(models.Materia, {
      foreignKey: 'id_materia',
      as: 'materia'
    });
    Curso.belongsTo(models.Profesor, {
      foreignKey: 'id_profesor',
      as: 'profesor'
    });
    Curso.hasMany(models.Inscripcion, {
      foreignKey: 'id_curso',
      as: 'inscripciones'
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'cursos',
      modelName: 'Curso',
      timestamps: false
    };
  }
}

const CursoSchema = {
  id_curso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_materia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materias',
      key: 'id_materia'
    }
  },
  id_profesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'profesores',
      key: 'id_profesor'
    }
  },
  periodo_academico: DataTypes.STRING(20)
};

module.exports = { Curso, CursoSchema };
