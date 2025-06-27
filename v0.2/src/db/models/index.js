require('dotenv').config({ path: './.env' });

const { Sequelize } = require('sequelize');
const { Estudiante, EstudianteSchema } = require('./estudiante.model');
const { Profesor, ProfesorSchema } = require('./profesor.model');
const { Materia, MateriaSchema } = require('./materia.model');
const { Nota, NotaSchema } = require('./nota.model');
const { Periodo, PeriodoSchema } = require('./periodo.model');
const { Usuario, UsuarioSchema } = require('./usuario.model');
const { Seccion, SeccionSchema } = require('./seccion.model');
const { ProfesorMateria, ProfesorMateriaSchema } = require('./profesor_materia.model');
const { EstudianteMateria, EstudianteMateriaSchema } = require('./estudiante_materia.model');
const { HistorialNotas, HistorialNotasSchema } = require('./historial_notas.model');

function setupModels(sequelize){
    Estudiante.init(EstudianteSchema, Estudiante.config(sequelize));
    Profesor.init(ProfesorSchema, Profesor.config(sequelize));
    Materia.init(MateriaSchema, Materia.config(sequelize));
    Nota.init(NotaSchema, Nota.config(sequelize));
    Periodo.init(PeriodoSchema, Periodo.config(sequelize));
    Usuario.init(UsuarioSchema, Usuario.config(sequelize));
    Seccion.init(SeccionSchema, Seccion.config(sequelize));
    ProfesorMateria.init(ProfesorMateriaSchema, ProfesorMateria.config(sequelize));
    EstudianteMateria.init(EstudianteMateriaSchema, EstudianteMateria.config(sequelize));
    HistorialNotas.init(HistorialNotasSchema, HistorialNotas.config(sequelize));

    // Asociaciones
    HistorialNotas.belongsTo(Estudiante, { foreignKey: 'id_estudiante', targetKey: 'id_estudiante' });
    HistorialNotas.belongsTo(Materia, { foreignKey: 'codigo_materia', targetKey: 'codigo_materia' });
    HistorialNotas.belongsTo(Profesor, { foreignKey: 'id_profesor', targetKey: 'id_profesor' });
    HistorialNotas.belongsTo(Periodo, { foreignKey: 'periodoId', targetKey: 'id' });

    Nota.belongsTo(Estudiante, { foreignKey: 'id_estudiante', targetKey: 'id_estudiante' });
    Nota.belongsTo(Materia, { foreignKey: 'codigo_materia', targetKey: 'codigo_materia' });
    Nota.belongsTo(Profesor, { foreignKey: 'id_profesor', targetKey: 'id_profesor' });

    Estudiante.belongsToMany(Materia, { through: EstudianteMateria, foreignKey: 'id_estudiante', otherKey: 'codigo_materia' });
    Materia.belongsToMany(Estudiante, { through: EstudianteMateria, foreignKey: 'codigo_materia', otherKey: 'id_estudiante' });
    Profesor.belongsToMany(Materia, { through: ProfesorMateria, foreignKey: 'id_profesor', otherKey: 'codigo_materia' });
    Materia.belongsToMany(Profesor, { through: ProfesorMateria, foreignKey: 'codigo_materia', otherKey: 'id_profesor' });
}

module.exports = {
  setupModels,
  Estudiante,
  EstudianteSchema,
  Profesor,
  ProfesorSchema,
  Materia,
  MateriaSchema,
  Nota,
  NotaSchema,
  Periodo,
  PeriodoSchema,
  Usuario,
  UsuarioSchema,
  Seccion,
  SeccionSchema,
  ProfesorMateria,
  ProfesorMateriaSchema,
  EstudianteMateria,
  EstudianteMateriaSchema,
  HistorialNotas,
  HistorialNotasSchema
};