const { Sequelize } = require('sequelize');
const { config } = require('../config/config');
const { setupModels } = require('../db/models');

function buildDatabaseUrl() {
    const user = (config.dbUser || '').replace(/'/g, '');
    const password = (config.dbPassword || '').replace(/'/g, '');
    const host = (config.dbHost || '').replace(/'/g, '');
    const port = (config.dbPort || '5432').toString().replace(/'/g, '');
    const db = (config.dbName || '').replace(/'/g, '');
    return `postgres://${user}:${password}@${host}:${port}/${db}`;
}

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    databaseUrl = buildDatabaseUrl();
    console.log('DATABASE_URL generado automáticamente:', databaseUrl);
}

const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
});

setupModels(sequelize);

const models = sequelize.models;

// Exportar modelos individuales para uso directo en servicios
const { Profesor, Materia, Estudiante, Usuario, Nota, Periodo, Seccion, ProfesorMateria, EstudianteMateria, HistorialNotas } = models;

module.exports = { sequelize, models, Profesor, Materia, Estudiante, Usuario, Nota, Periodo, Seccion, ProfesorMateria, EstudianteMateria, HistorialNotas };