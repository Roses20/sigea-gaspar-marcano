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
    periodo_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'periodos', // Debe coincidir con el nombre real de la tabla
            key: 'id'
        }
    }
}

module.exports = { Seccion, SeccionSchema, SECCION };