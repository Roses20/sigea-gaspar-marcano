const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Incluye el rol en req.user
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido' });
    }
}

function checkRole(allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user.rol;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        next();
    };
}

module.exports = { authenticateToken, checkRole };
