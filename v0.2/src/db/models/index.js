const { Sequelize } = require('sequelize');
const { Estudiante, EstudianteSchema } = require('./estudiante.model');
const { Profesor, ProfesorSchema } = require('./profesor.model');
const { Materia, MateriaSchema } = require('./materia.model');
const { Nota, NotaSchema } = require('./nota.model');
const { Periodo, PeriodoSchema } = require('./periodo.model');
const { Usuario, UsuarioSchema } = require('./usuario.model');
const { Seccion, SeccionSchema } = require('./seccion.model');
const { ProfesorMateria, ProfesorMateriaSchema } = require('./profesor_materia.model');

// Configura tu conexión Sequelize aquí
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
});

function setupModels(sequelize){
    Estudiante.init(EstudianteSchema, Estudiante.config(sequelize));
    Profesor.init(ProfesorSchema, Profesor.config(sequelize));
    Materia.init(MateriaSchema, Materia.config(sequelize));
    Nota.init(NotaSchema, Nota.config(sequelize));
    Periodo.init(PeriodoSchema, Periodo.config(sequelize));
    Usuario.init(UsuarioSchema, Usuario.config(sequelize));
    Seccion.init(SeccionSchema, Seccion.config(sequelize));
    ProfesorMateria.init(ProfesorMateriaSchema, ProfesorMateria.config(sequelize));
}
// Aquí puedes definir asociaciones si las necesitas
// Ejemplo: Estudiante.belongsTo(Seccion, { foreignKey: 'seccionId' });

module.exports = setupModels;