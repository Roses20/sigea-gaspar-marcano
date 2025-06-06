const { Model, DataTypes } = require('sequelize');

const PROFESOR = 'profesor';

class Profesor extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: PROFESOR,
            modelName: 'Profesor',
            timestamps: false
        }
    }
}

const ProfesorSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    nombre: {
        allowNull: false,
        type: DataTypes.STRING
    },
    apellido: {
        allowNull: false,
        type: DataTypes.STRING
    },
    cedula: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
    },
    telefono: {
        allowNull: false,
        type: DataTypes.STRING
    },
    direccion: {
        allowNull: true,
        type: DataTypes.STRING
    },
    materia: {
        allowNull: false,
        type: DataTypes.STRING
    }
}

module.exports = { Profesor, ProfesorSchema, PROFESOR };