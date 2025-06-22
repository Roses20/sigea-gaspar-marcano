const { Model, DataTypes } = require('sequelize');

const MATERIA = 'materia';

class Materia extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: MATERIA,
            modelName: 'Materia',
            timestamps: false
        }
    }
}

const MateriaSchema = {
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
    codigo: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
    },
    descripcion: {
        allowNull: true,
        type: DataTypes.STRING
    }
}

module.exports = { Materia, MateriaSchema, MATERIA };