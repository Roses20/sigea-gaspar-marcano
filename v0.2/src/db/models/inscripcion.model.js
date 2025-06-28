const { Model, DataTypes } = require('sequelize');

class Inscripcion extends Model {
  static associate(models) {
    Inscripcion.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudiante'
    });
    Inscripcion.belongsTo(models.Curso, {
      foreignKey: 'id_curso',
      as: 'curso'
    });
    Inscripcion.hasMany(models.Calificacion, {
      foreignKey: 'id_inscripcion',
      as: 'calificaciones'
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'inscripciones',
      modelName: 'Inscripcion',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['id_estudiante', 'id_curso']
        }
      ]
    };
  }
}

const InscripcionSchema = {
  id_inscripcion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_estudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'estudiantes',
      key: 'id_estudiante'
    }
  },
  id_curso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cursos',
      key: 'id_curso'
    }
  },
  fecha_inscripcion: DataTypes.DATEONLY,
  estado: DataTypes.STRING(20)
};

module.exports = { Inscripcion, InscripcionSchema };
