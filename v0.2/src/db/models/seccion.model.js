const { Model, DataTypes } = require('sequelize');

const SECCION = 'seccion';

class Seccion extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: SECCION,
            modelName: 'Seccion',
            timestamps: false
        }
    }
}

const SeccionSchema = {
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
    anio: {
        allowNull: false,
        type: DataTypes.STRING
    },
    tutorId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        field: 'tutor_id',
        references: {
            model: 'profesor',
            key: 'id'
        }
    }
}

module.exports = { Seccion, SeccionSchema, SECCION };