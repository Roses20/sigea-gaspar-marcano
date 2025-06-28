require('dotenv').config({ path: './.env' });

const { Sequelize } = require('sequelize');
const { Estudiante, EstudianteSchema } = require('./estudiante.model');
const { Profesor, ProfesorSchema } = require('./profesor.model');
const { setupProfesor } = require('./profesor.model');
const { Materia, MateriaSchema } = require('./materia.model');
const { Usuario, UsuarioSchema } = require('./usuario.model');
const { Curso, CursoSchema } = require('./curso.model');
const { Inscripcion, InscripcionSchema } = require('./inscripcion.model');
const { Calificacion, CalificacionSchema } = require('./calificacion.model');

// Verificación de modelos importados
if (!Estudiante) throw new Error('Estudiante model is undefined');
if (!Profesor) throw new Error('Profesor model is undefined');
if (!Materia) throw new Error('Materia model is undefined');
if (!Usuario) throw new Error('Usuario model is undefined');
if (!Curso) throw new Error('Curso model is undefined');
if (!Inscripcion) throw new Error('Inscripcion model is undefined');
if (!Calificacion) throw new Error('Calificacion model is undefined');

function setupModels(sequelize){
    Estudiante.init(EstudianteSchema, Estudiante.config(sequelize));
    setupProfesor(sequelize);
    Materia.init(MateriaSchema, Materia.config(sequelize));
    Usuario.init(UsuarioSchema, Usuario.config(sequelize));
    Curso.init(CursoSchema, Curso.config(sequelize));
    Inscripcion.init(InscripcionSchema, Inscripcion.config(sequelize));
    Calificacion.init(CalificacionSchema, Calificacion.config(sequelize));

    // Asociaciones
    Estudiante.hasMany(Inscripcion, { foreignKey: 'id_estudiante', as: 'inscripciones' });
    Inscripcion.belongsTo(Estudiante, { foreignKey: 'id_estudiante', as: 'estudiante' });

    Profesor.hasMany(Curso, { foreignKey: 'id_profesor', as: 'cursos' });
    Curso.belongsTo(Profesor, { foreignKey: 'id_profesor', as: 'profesor' });

    Materia.hasMany(Curso, { foreignKey: 'id_materia', as: 'cursos' });
    Curso.belongsTo(Materia, { foreignKey: 'id_materia', as: 'materia' });

    Curso.hasMany(Inscripcion, { foreignKey: 'id_curso', as: 'inscripciones' });
    Inscripcion.belongsTo(Curso, { foreignKey: 'id_curso', as: 'curso' });

    Inscripcion.hasMany(Calificacion, { foreignKey: 'id_inscripcion', as: 'calificaciones' });
    Calificacion.belongsTo(Inscripcion, { foreignKey: 'id_inscripcion', as: 'inscripcion' });

    // Asociaciones de Usuario
    if (Usuario.associate) Usuario.associate(sequelize.models);
}

module.exports = {
  setupModels,
  Estudiante,
  EstudianteSchema,
  Profesor,
  ProfesorSchema,
  Materia,
  MateriaSchema,
  Usuario,
  UsuarioSchema,
  Curso,
  CursoSchema,
  Inscripcion,
  InscripcionSchema,
  Calificacion,
  CalificacionSchema
};