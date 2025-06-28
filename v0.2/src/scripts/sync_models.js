const { sequelize } = require('../libs/sequelize');

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados correctamente con la base de datos.');
    process.exit(0);
  } catch (err) {
    console.error('Error al sincronizar modelos:', err);
    process.exit(1);
  }
})();
