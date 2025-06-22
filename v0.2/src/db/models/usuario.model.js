const { Model, DataTypes } = require('sequelize');

const USUARIO = 'usuario';

class Usuario extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: USUARIO,
            modelName: 'Usuario',
            timestamps: false
        }
    }
}

const UsuarioSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    username: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING
    },
    rol: {
        allowNull: false,
        type: DataTypes.STRING
    },
    email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
    }
}

module.exports = { Usuario, UsuarioSchema, USUARIO };