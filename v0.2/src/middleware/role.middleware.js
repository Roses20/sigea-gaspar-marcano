function checkRole(allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user.rol;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        next();
    };
}

module.exports = { checkRole };
