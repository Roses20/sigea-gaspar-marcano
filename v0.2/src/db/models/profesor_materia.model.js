const { Model, DataTypes } = require('sequelize');

const PROFESOR_MATERIA = 'profesor_materia';

class ProfesorMateria extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: PROFESOR_MATERIA,
            modelName: 'ProfesorMateria',
            timestamps: false
        }
    }
}

const ProfesorMateriaSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    profesorId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'profesor_id',
        references: {
            model: 'profesor',
            key: 'id'
        }
    },
    materiaId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'materia_id',
        references: {
            model: 'materia',
            key: 'id'
        }
    }
}

module.exports = { ProfesorMateria, ProfesorMateriaSchema, PROFESOR_MATERIA };