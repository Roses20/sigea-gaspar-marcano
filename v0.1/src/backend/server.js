require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Configuración de conexión a PostgreSQL
const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
});

// Middleware para verificar token y rol
function auth(requiredRoles = []) {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Token requerido' });
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: 'Token inválido' });
            if (requiredRoles.length && !requiredRoles.includes(user.rol)) {
                return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
            }
            req.user = user;
            next();
        });
    };
}

// Endpoint: Registro de usuario (solo admin puede crear usuarios con rol distinto a estudiante)
app.post('/api/registro', auth(['admin']), async (req, res) => {
    const { usuario, email, contrasena, nombre_completo, rol = 'estudiante' } = req.body;
    if (!usuario || !email || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    try {
        const existe = await pool.query('SELECT 1 FROM usuarios WHERE usuario = $1 OR email = $2', [usuario, email]);
        if (existe.rows.length > 0) {
            return res.status(409).json({ error: 'Usuario o correo ya registrado.' });
        }
        const hash = await bcrypt.hash(contrasena, 10);
        await pool.query('INSERT INTO usuarios (usuario, email, contrasena, nombre_completo, rol) VALUES ($1, $2, $3, $4, $5)', [usuario, email, hash, nombre_completo, rol]);
        res.json({ success: true, message: 'Usuario registrado correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Endpoint: Login de usuario (devuelve token JWT)
app.post('/api/login', async (req, res) => {
    const { usuario, contrasena } = req.body;
    try {
        // Permitir login por usuario o correo
        const result = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 OR email = $1', [usuario]);
        if (result.rows.length === 0) {
            console.log('[LOGIN] Usuario no encontrado:', usuario);
            return res.json({ success: false, message: 'El usuario no existe.' });
        }
        const user = result.rows[0];
        console.log('[LOGIN] Usuario encontrado:', user.usuario, '| Hash en BD:', user.contrasena);
        const valid = await bcrypt.compare(contrasena, user.contrasena);
        console.log('[LOGIN] Resultado bcrypt.compare:', valid);
        if (valid) {
            const token = jwt.sign({ id: user.id, usuario: user.usuario, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
            res.json({ success: true, nombre: user.nombre_completo || user.usuario, rol: user.rol, token });
        } else {
            console.log('[LOGIN] Contraseña incorrecta para usuario:', usuario);
            res.json({ success: false, message: 'Contraseña incorrecta.' });
        }
    } catch (err) {
        console.error('[LOGIN] Error en el servidor:', err);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// Endpoint: Prueba de conexión
app.get('/api/ping', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// Endpoint: Listar usuarios (solo admin)
app.get('/api/usuarios', auth(['admin']), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, usuario, email, rol, nombre_completo, creado_en FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Endpoint: Obtener usuario por id (admin y el propio usuario)
app.get('/api/usuarios/:id', auth(['admin', 'profesor', 'estudiante']), async (req, res) => {
    const { id } = req.params;
    if (req.user.rol !== 'admin' && req.user.id != id) {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    try {
        const result = await pool.query('SELECT id, usuario, email, rol, nombre_completo, creado_en FROM usuarios WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Endpoint: Editar usuario (admin puede editar todo, usuario solo su info)
app.put('/api/usuarios/:id', auth(['admin', 'profesor', 'estudiante']), async (req, res) => {
    const { id } = req.params;
    const { email, nombre_completo, rol } = req.body;
    if (req.user.rol !== 'admin' && req.user.id != id) {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    try {
        let query = 'UPDATE usuarios SET email = $1, nombre_completo = $2';
        let params = [email, nombre_completo, id];
        if (req.user.rol === 'admin' && rol) {
            query += ', rol = $3 WHERE id = $4';
            params = [email, nombre_completo, rol, id];
        } else {
            query += ' WHERE id = $3';
        }
        await pool.query(query, params);
        res.json({ success: true, message: 'Usuario actualizado' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Endpoint: Eliminar usuario (solo admin)
app.delete('/api/usuarios/:id', auth(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.json({ success: true, message: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Endpoint: Cambiar contraseña (admin o el propio usuario)
app.put('/api/usuarios/:id/password', auth(['admin', 'profesor', 'estudiante']), async (req, res) => {
    const { id } = req.params;
    const { nuevaContrasena } = req.body;
    if (req.user.rol !== 'admin' && req.user.id != id) {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    try {
        const hash = await bcrypt.hash(nuevaContrasena, 10);
        await pool.query('UPDATE usuarios SET contrasena = $1 WHERE id = $2', [hash, id]);
        res.json({ success: true, message: 'Contraseña actualizada' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// --- Gestión de estudiantes (adaptado a sistema_notas_postgresql.sql) ---
// Listar estudiantes (admin y profesor)
app.get('/api/estudiantes', auth(['admin', 'profesor']), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM estudiantes ORDER BY apellido, nombre');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener estudiante por id (admin, profesor)
app.get('/api/estudiantes/:id', auth(['admin', 'profesor']), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM estudiantes WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Registrar estudiante (admin y profesor)
app.post('/api/estudiantes', auth(['admin', 'profesor']), async (req, res) => {
    const { nombre, apellido, cedula, fecha_nacimiento, anio, seccion, direccion, telefono, correo } = req.body;
    if (!nombre || !apellido || !cedula) {
        return res.status(400).json({ error: 'Nombre, apellido y cédula son obligatorios.' });
    }
    try {
        const existe = await pool.query('SELECT 1 FROM estudiantes WHERE cedula = $1', [cedula]);
        if (existe.rows.length > 0) {
            return res.status(409).json({ error: 'Ya existe un estudiante con esa cédula.' });
        }
        await pool.query(
            'INSERT INTO estudiantes (nombre, apellido, cedula, fecha_nacimiento, anio, seccion, direccion, telefono, correo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [nombre, apellido, cedula, fecha_nacimiento, anio, seccion, direccion, telefono, correo]
        );
        res.json({ success: true, message: 'Estudiante registrado correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Editar estudiante (admin y profesor)
app.put('/api/estudiantes/:id', auth(['admin', 'profesor']), async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, cedula, fecha_nacimiento, anio, seccion, direccion, telefono, correo } = req.body;
    try {
        await pool.query(
            'UPDATE estudiantes SET nombre = $1, apellido = $2, cedula = $3, fecha_nacimiento = $4, anio = $5, seccion = $6, direccion = $7, telefono = $8, correo = $9 WHERE id = $10',
            [nombre, apellido, cedula, fecha_nacimiento, anio, seccion, direccion, telefono, correo, id]
        );
        res.json({ success: true, message: 'Estudiante actualizado' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar estudiante (solo admin)
app.delete('/api/estudiantes/:id', auth(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM estudiantes WHERE id = $1', [id]);
        res.json({ success: true, message: 'Estudiante eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// --- Gestión de materias (adaptado a sistema_notas_postgresql.sql) ---
// Listar materias (admin y profesor)
app.get('/api/materias', auth(['admin', 'profesor']), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM materias ORDER BY nombre');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener materia por id (admin y profesor)
app.get('/api/materias/:id', auth(['admin', 'profesor']), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM materias WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Materia no encontrada' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Registrar materia (admin y profesor)
app.post('/api/materias', auth(['admin', 'profesor']), async (req, res) => {
    const { nombre, descripcion, codigo, profesor_id } = req.body;
    if (!nombre || !codigo) {
        return res.status(400).json({ error: 'Nombre y código son obligatorios.' });
    }
    try {
        const existe = await pool.query('SELECT 1 FROM materias WHERE codigo = $1', [codigo]);
        if (existe.rows.length > 0) {
            return res.status(409).json({ error: 'Ya existe una materia con ese código.' });
        }
        await pool.query(
            'INSERT INTO materias (nombre, descripcion, codigo, profesor_id) VALUES ($1, $2, $3, $4)',
            [nombre, descripcion, codigo, profesor_id || null]
        );
        res.json({ success: true, message: 'Materia registrada correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Editar materia (admin y profesor)
app.put('/api/materias/:id', auth(['admin', 'profesor']), async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, codigo, profesor_id } = req.body;
    try {
        await pool.query(
            'UPDATE materias SET nombre = $1, descripcion = $2, codigo = $3, profesor_id = $4 WHERE id = $5',
            [nombre, descripcion, codigo, profesor_id || null, id]
        );
        res.json({ success: true, message: 'Materia actualizada' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar materia (solo admin)
app.delete('/api/materias/:id', auth(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM materias WHERE id = $1', [id]);
        res.json({ success: true, message: 'Materia eliminada' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// --- Gestión de profesores ---
// Listar profesores (admin y profesor)
app.get('/api/profesores', auth(['admin', 'profesor']), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM profesores ORDER BY apellido, nombre');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener profesor por id (admin y profesor)
app.get('/api/profesores/:id', auth(['admin', 'profesor']), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM profesores WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Profesor no encontrado' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Registrar profesor (solo admin)
app.post('/api/profesores', auth(['admin']), async (req, res) => {
    const { cedula, nombre, apellido, correo, telefono, direccion } = req.body;
    if (!cedula || !nombre || !apellido) {
        return res.status(400).json({ error: 'Cédula, nombre y apellido son obligatorios.' });
    }
    try {
        const existe = await pool.query('SELECT 1 FROM profesores WHERE cedula = $1', [cedula]);
        if (existe.rows.length > 0) {
            return res.status(409).json({ error: 'Ya existe un profesor con esa cédula.' });
        }
        await pool.query(
            'INSERT INTO profesores (cedula, nombre, apellido, correo, telefono, direccion) VALUES ($1, $2, $3, $4, $5, $6)',
            [cedula, nombre, apellido, correo, telefono, direccion]
        );
        res.json({ success: true, message: 'Profesor registrado correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Editar profesor (solo admin)
app.put('/api/profesores/:id', auth(['admin']), async (req, res) => {
    const { id } = req.params;
    const { cedula, nombre, apellido, correo, telefono, direccion } = req.body;
    try {
        await pool.query(
            'UPDATE profesores SET cedula = $1, nombre = $2, apellido = $3, correo = $4, telefono = $5, direccion = $6 WHERE id = $7',
            [cedula, nombre, apellido, correo, telefono, direccion, id]
        );
        res.json({ success: true, message: 'Profesor actualizado' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar profesor (solo admin)
app.delete('/api/profesores/:id', auth(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM profesores WHERE id = $1', [id]);
        res.json({ success: true, message: 'Profesor eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// --- Gestión de inscripciones ---
// Listar inscripciones (admin y profesor)
app.get('/api/inscripciones', auth(['admin', 'profesor']), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT i.id, i.periodo, 
                   e.id AS estudiante_id, e.cedula AS estudiante_cedula, e.nombre AS estudiante_nombre, e.apellido AS estudiante_apellido,
                   m.id AS materia_id, m.nombre AS materia_nombre, m."año" AS materia_año,
                   p.id AS profesor_id, p.nombre AS profesor_nombre, p.apellido AS profesor_apellido
            FROM inscripciones i
            JOIN estudiantes e ON i.estudiante_id = e.id
            JOIN materias m ON i.materia_id = m.id
            JOIN profesores p ON i.profesor_id = p.id
            ORDER BY i.periodo DESC, m."año", m.nombre, e.apellido
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener inscripción por id (admin y profesor)
app.get('/api/inscripciones/:id', auth(['admin', 'profesor']), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM inscripciones WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Inscripción no encontrada' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Registrar inscripción (admin y profesor)
app.post('/api/inscripciones', auth(['admin', 'profesor']), async (req, res) => {
    const { estudiante_id, materia_id, profesor_id, periodo } = req.body;
    if (!estudiante_id || !materia_id || !profesor_id || !periodo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    try {
        const existe = await pool.query('SELECT 1 FROM inscripciones WHERE estudiante_id = $1 AND materia_id = $2 AND periodo = $3', [estudiante_id, materia_id, periodo]);
        if (existe.rows.length > 0) {
            return res.status(409).json({ error: 'Ya existe una inscripción para ese estudiante, materia y periodo.' });
        }
        await pool.query(
            'INSERT INTO inscripciones (estudiante_id, materia_id, profesor_id, periodo) VALUES ($1, $2, $3, $4)',
            [estudiante_id, materia_id, profesor_id, periodo]
        );
        res.json({ success: true, message: 'Inscripción registrada correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Editar inscripción (admin y profesor)
app.put('/api/inscripciones/:id', auth(['admin', 'profesor']), async (req, res) => {
    const { id } = req.params;
    const { estudiante_id, materia_id, profesor_id, periodo } = req.body;
    try {
        await pool.query(
            'UPDATE inscripciones SET estudiante_id = $1, materia_id = $2, profesor_id = $3, periodo = $4 WHERE id = $5',
            [estudiante_id, materia_id, profesor_id, periodo, id]
        );
        res.json({ success: true, message: 'Inscripción actualizada' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar inscripción (solo admin)
app.delete('/api/inscripciones/:id', auth(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM inscripciones WHERE id = $1', [id]);
        res.json({ success: true, message: 'Inscripción eliminada' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// --- Gestión de notas ---
// Listar notas (admin y profesor)
app.get('/api/notas', auth(['admin', 'profesor']), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT n.id, n.nota, n.observaciones, n.inscripcion_id,
                   i.estudiante_id, i.materia_id, i.profesor_id, i.periodo
            FROM notas n
            JOIN inscripciones i ON n.inscripcion_id = i.id
            ORDER BY n.id DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener nota por id (admin y profesor)
app.get('/api/notas/:id', auth(['admin', 'profesor']), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM notas WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Nota no encontrada' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Registrar nota (admin y profesor)
app.post('/api/notas', auth(['admin', 'profesor']), async (req, res) => {
    const { inscripcion_id, nota, observaciones } = req.body;
    if (!inscripcion_id || typeof nota === 'undefined') {
        return res.status(400).json({ error: 'Inscripción y nota son obligatorios.' });
    }
    try {
        // Validar rango de nota
        if (nota < 0 || nota > 100) {
            return res.status(400).json({ error: 'La nota debe estar entre 0 y 100.' });
        }
        await pool.query(
            'INSERT INTO notas (inscripcion_id, nota, observaciones) VALUES ($1, $2, $3)',
            [inscripcion_id, nota, observaciones]
        );
        res.json({ success: true, message: 'Nota registrada correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Editar nota (admin y profesor)
app.put('/api/notas/:id', auth(['admin', 'profesor']), async (req, res) => {
    const { id } = req.params;
    const { nota, observaciones } = req.body;
    try {
        if (nota < 0 || nota > 100) {
            return res.status(400).json({ error: 'La nota debe estar entre 0 y 100.' });
        }
        await pool.query(
            'UPDATE notas SET nota = $1, observaciones = $2 WHERE id = $3',
            [nota, observaciones, id]
        );
        res.json({ success: true, message: 'Nota actualizada' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar nota (solo admin)
app.delete('/api/notas/:id', auth(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM notas WHERE id = $1', [id]);
        res.json({ success: true, message: 'Nota eliminada' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// --- Reportes y consultas avanzadas ---
// 1. Materias inscritas de un estudiante (por id de estudiante)
app.get('/api/reportes/estudiante/:id/materias', auth(['admin', 'profesor', 'estudiante']), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT m.*
            FROM inscripciones i
            JOIN materias m ON i.materia_id = m.id
            WHERE i.estudiante_id = $1
            ORDER BY m.nombre
        `, [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// 2. Todas las notas de un estudiante (por id de estudiante)
app.get('/api/reportes/estudiante/:id/notas', auth(['admin', 'profesor', 'estudiante']), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT n.*, m.nombre AS materia_nombre, m.codigo AS materia_codigo, i.periodo
            FROM notas n
            JOIN inscripciones i ON n.inscripcion_id = i.id
            JOIN materias m ON i.materia_id = m.id
            WHERE i.estudiante_id = $1
            ORDER BY i.periodo DESC, m.nombre
        `, [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// 3. Inscripciones por período (todas las inscripciones de un período)
app.get('/api/reportes/inscripciones/periodo/:periodo', auth(['admin', 'profesor']), async (req, res) => {
    const { periodo } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*, e.nombre AS estudiante_nombre, e.apellido AS estudiante_apellido, m.nombre AS materia_nombre, p.nombre AS profesor_nombre, p.apellido AS profesor_apellido
            FROM inscripciones i
            JOIN estudiantes e ON i.estudiante_id = e.id
            JOIN materias m ON i.materia_id = m.id
            JOIN profesores p ON i.profesor_id = p.id
            WHERE i.periodo = $1
            ORDER BY m.nombre, e.apellido
        `, [periodo]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// 4. Estudiantes por materia (por id de materia)
app.get('/api/reportes/materia/:id/estudiantes', auth(['admin', 'profesor']), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT e.*
            FROM inscripciones i
            JOIN estudiantes e ON i.estudiante_id = e.id
            WHERE i.materia_id = $1
            ORDER BY e.apellido, e.nombre
        `, [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// 5. Estudiantes por sección (por año y sección)
app.get('/api/reportes/estudiantes/seccion', auth(['admin', 'profesor']), async (req, res) => {
    const { anio, seccion } = req.query;
    try {
        const result = await pool.query(`
            SELECT * FROM estudiantes WHERE anio = $1 AND seccion = $2 ORDER BY apellido, nombre
        `, [anio, seccion]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});