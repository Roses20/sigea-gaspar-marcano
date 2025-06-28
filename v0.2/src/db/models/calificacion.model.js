const { Model, DataTypes } = require('sequelize');

class Calificacion extends Model {
  static associate(models) {
    Calificacion.belongsTo(models.Inscripcion, {
      foreignKey: 'id_inscripcion',
      as: 'inscripcion'
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'calificaciones',
      modelName: 'Calificacion',
      timestamps: false
    };
  }
}

const CalificacionSchema = {
  id_calificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_inscripcion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'inscripciones',
      key: 'id_inscripcion'
    }
  },
  tipo_evaluacion: DataTypes.STRING(50),
  puntaje: DataTypes.FLOAT,
  porcentaje: DataTypes.FLOAT,
  fecha_registro: DataTypes.DATEONLY,
  comentarios: DataTypes.STRING(255)
};

module.exports = { Calificacion, CalificacionSchema };
