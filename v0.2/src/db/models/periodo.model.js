const { Model, DataTypes } = require('sequelize');

const PERIODO = 'periodos';

class Periodo extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: PERIODO,
            modelName: 'Periodo',
            timestamps: false
        }
    }
}

const PeriodoSchema = {
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
    fecha_inicio: {
        allowNull: false,
        type: DataTypes.DATEONLY
    },
    fecha_fin: {
        allowNull: false,
        type: DataTypes.DATEONLY
    }
}

module.exports = { Periodo, PeriodoSchema, PERIODO };