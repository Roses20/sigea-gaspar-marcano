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
    estudianteId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'estudiante_id',
        references: {
            model: 'estudiante',
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
    },
    profesorId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        field: 'profesor_id',
        references: {
            model: 'profesor',
            key: 'id'
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