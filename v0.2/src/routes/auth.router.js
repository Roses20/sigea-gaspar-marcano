const express = require('express');
const { generateToken, hashPassword, comparePassword } = require('../auth/auth');
const { models } = require('../libs/sequelize');
const { loginRateLimiter } = require('../middleware/rateLimiter.middleware');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Endpoint para registro de usuarios
router.post('/register', authenticateToken, checkRole(['admin']), async (req, res, next) => {
    try {
        const { email, password, rol } = req.body;
        const hashedPassword = await hashPassword(password);
        const newUser = await models.Usuario.create({ email, password: hashedPassword, rol });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

// Endpoint para inicio de sesión
router.post('/login', loginRateLimiter, async (req, res, next) => {
    try {
        // Extraer email y password del body
        const { email, password } = req.body;
        // Validación de campos obligatorios
        if (!email || !password) {
            return res.status(400).json({ message: 'Los campos email y password son obligatorios' });
        }

        const user = await models.Usuario.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const token = generateToken({ id: user.id, email: user.email, rol: user.rol });
        // Preparar objeto usuario sin contraseña
        const usuarioSinPassword = {
            id: user.id,
            email: user.email,
            rol: user.rol,
            username: user.username,
            nombre: user.nombre || '',
            apellido: user.apellido || ''
        };
        res.json({ token, usuario: usuarioSinPassword });
    } catch (error) {
        next(error);
    }
});

module.exports = router;