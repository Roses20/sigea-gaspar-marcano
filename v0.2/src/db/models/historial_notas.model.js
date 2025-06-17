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
    estudianteId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'estudiante',
            key: 'id'
        }
    },
    materiaId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'materia',
            key: 'id'
        }
    },
    profesorId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'profesor',
            key: 'id'
        }
    },
    periodoId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'periodo',
            key: 'id'
        }
    },
    nota: {
        allowNull: false,
        type: DataTypes.INTEGER
    }
};

module.exports = { HistorialNotas, HistorialNotasSchema, HISTORIAL_NOTAS };
