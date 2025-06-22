const { Model, DataTypes } = require('sequelize');

const HISTORIAL_NOTAS = 'historial_notas';

class HistorialNotas extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: HISTORIAL_NOTAS,
            modelName: 'HistorialNotas',
            timestamps: false
        };
    }
}

const HistorialNotasSchema = {
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
        allowNull: false,
        type: DataTypes.STRING(10),
        field: 'id_profesor',
        references: {
            model: 'profesor',
            key: 'id_profesor'
        }
    },
    periodoId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'periodos', // Debe coincidir con el nombre de la tabla de Periodo
            key: 'id'
        }
    },
    nota: {
        allowNull: false,
        type: DataTypes.INTEGER
    }
};

module.exports = { HistorialNotas, HistorialNotasSchema, HISTORIAL_NOTAS };
