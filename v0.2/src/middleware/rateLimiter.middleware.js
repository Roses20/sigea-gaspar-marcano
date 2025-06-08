const rateLimit = require('express-rate-limit');

// Configuración del limitador de solicitudes
const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo de 5 intentos de inicio de sesión por IP
    message: {
        message: 'Demasiados intentos de inicio de sesión desde esta IP, por favor inténtelo de nuevo después de 15 minutos.'
    },
    standardHeaders: true, // Enviar información de límite en los encabezados
    legacyHeaders: false, // Deshabilitar encabezados obsoletos
});

module.exports = { loginRateLimiter };
