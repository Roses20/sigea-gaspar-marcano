const { verifyToken } = require('../auth/auth');

// Middleware para verificar el token JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const user = verifyToken(token);
        req.user = user; // Agrega la información del usuario al objeto req
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido.' });
    }
}

module.exports = { authenticateToken };
