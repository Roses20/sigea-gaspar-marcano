const express = require('express');
require('dotenv').config({ path: './.env' });
const cors = require('cors');
const path = require('path');

// Centraliza la carga de las variables de entorno
module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
};

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    console.log('Received a GET request');
    console.log('Port ===>', port);
    res.send('Servidor arrancado. Bienvenido.');
});

const estudianteRoutes = require('./routes/estudiante.router');
const profesorRoutes = require('./routes/profesor.router');
const materiaRoutes = require('./routes/materia.router');
const notaRoutes = require('./routes/nota.router');
const periodoRoutes = require('./routes/periodo.router'); 
const usuarioRoutes = require('./routes/usuario.router');
const profesorMateriaRoutes = require('./routes/profesor_materia.router');
const seccionRoutes = require('./routes/seccion.router');
const authRoutes = require('./routes/auth.router');
const dashboardRoutes = require('./routes/dashboard.router');
const reportesRoutes = require('./routes/reportes.router');

app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/profesores', profesorRoutes);
app.use('/api/materias', materiaRoutes);
app.use('/api/notas', notaRoutes);
app.use('/api/periodos', periodoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/profesor-materias', profesorMateriaRoutes);
app.use('/api/secciones', seccionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reportes', reportesRoutes);

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
