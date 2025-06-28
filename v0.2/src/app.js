const express = require('express');
require('dotenv').config({ path: './.env' });
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./libs/sequelize');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importar y usar la ruta de autenticación
const authRoutes = require('./routes/auth.router');
app.use('/api/auth', authRoutes);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.send('Servidor arrancado. Bienvenido.');
});

// Importar solo las rutas CRUD del nuevo esquema
const estudianteRoutes = require('./routes/estudiante.router');
const profesorRoutes = require('./routes/profesor.router');
const materiaRoutes = require('./routes/materia.router');
const cursoRoutes = require('./routes/curso.router');
const inscripcionRoutes = require('./routes/inscripcion.router');
const calificacionRoutes = require('./routes/calificacion.router');
const usuarioRoutes = require('./routes/usuario.router');

app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/profesores', profesorRoutes);
app.use('/api/materias', materiaRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/calificaciones', calificacionRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Inicia el servidor y sincroniza con PostgreSQL
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada correctamente.');
    app.listen(port, () => {
      console.log(`Servidor escuchando en puerto ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err);
  });
