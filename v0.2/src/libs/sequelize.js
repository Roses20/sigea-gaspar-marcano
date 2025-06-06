const { Sequelize } = require('sequelize');
const { config } = require('../config/config');
const setupModels = require('../db/models'); // Corrige la importación de setupModels

const sequelize = new Sequelize(
    config.dbName,
    config.dbUser,
    config.dbPassword,
    {
        host: config.dbHost,
        dialect: 'postgres',
    }
);

sequelize.sync();
setupModels(sequelize);

module.exports = sequelize;