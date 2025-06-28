const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
  static associate(models) {
    // Relación con estudiante y profesor (ambos opcionales)
    Usuario.belongsTo(models.Estudiante, {
      foreignKey: 'id_persona',
      as: 'estudiante',
      constraints: false
    });
    Usuario.belongsTo(models.Profesor, {
      foreignKey: 'id_persona',
      as: 'profesor',
      constraints: false
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'usuarios',
      modelName: 'Usuario',
      timestamps: false
    };
  }
}

const UsuarioSchema = {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  id_persona: DataTypes.INTEGER, // FK a estudiante o profesor
  ultimo_login: DataTypes.DATE,
  estado: DataTypes.STRING(20)
};

module.exports = { Usuario, UsuarioSchema };