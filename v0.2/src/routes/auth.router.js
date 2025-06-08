const express = require('express');
const { generateToken, hashPassword, comparePassword } = require('../auth/auth');
const { models } = require('../libs/sequelize');
const { loginRateLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

// Endpoint para registro de usuarios
router.post('/register', async (req, res, next) => {
    try {
        const { username, password, rol } = req.body;
        const hashedPassword = await hashPassword(password);
        const newUser = await models.Usuario.create({ username, password: hashedPassword, rol });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

// Endpoint para inicio de sesión
router.post('/login', loginRateLimiter, async (req, res, next) => {
    try {
        console.log('Request body:', req.body); // Depurar el cuerpo de la solicitud
        const { username, password } = req.body;

        // Validación de campos obligatorios
        if (!username || !password) {
            return res.status(400).json({ message: 'Los campos username y password son obligatorios' });
        }

        const user = await models.Usuario.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const token = generateToken({ id: user.id, username: user.username, rol: user.rol });
        res.json({ token });
    } catch (error) {
        next(error);
    }
});

module.exports = router;