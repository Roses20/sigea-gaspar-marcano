const { Model, DataTypes } = require('sequelize');

const NOTA = 'nota';

class Nota extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: NOTA,
            modelName: 'Nota',
            timestamps: false
        }
    }
}

const NotaSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    id_estudiante: {
        allowNull: false,
        type: DataTypes.STRING(10),
        field: 'id_estudiante',
        references: {
            model: 'estudiante',
            key: 'id_estudiante'
        }
    },
    codigo_materia: {
        allowNull: false,
        type: DataTypes.STRING(20),
        field: 'codigo_materia',
        references: {
            model: 'materia',
            key: 'codigo_materia'
        }
    },
    id_profesor: {
        allowNull: true,
        type: DataTypes.STRING(10),
        field: 'id_profesor',
        references: {
            model: 'profesor',
            key: 'id_profesor'
        }
    },
    periodo: {
        allowNull: false,
        type: DataTypes.STRING
    },
    valor: {
        allowNull: false,
        type: DataTypes.FLOAT
    }
}

module.exports = { Nota, NotaSchema, NOTA };