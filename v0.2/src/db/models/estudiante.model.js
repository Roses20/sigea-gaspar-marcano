const { Model, DataTypes } = require('sequelize');

const ESTUDIANTE = 'estudiante';

class Estudiante extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: ESTUDIANTE,
            modelName: 'Estudiante',
            timestamps: false
        }
    }
}

const EstudianteSchema = {
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
    fecha_nacimiento: {
        allowNull: false,
        type: DataTypes.DATEONLY
    },
    direccion: {
        allowNull: true,
        type: DataTypes.STRING
    },
    anio: {
        allowNull: false,
        type: DataTypes.STRING
    },
    seccion: {
        allowNull: false,
        type: DataTypes.STRING
    }
}

module.exports = { Estudiante, EstudianteSchema, ESTUDIANTE };