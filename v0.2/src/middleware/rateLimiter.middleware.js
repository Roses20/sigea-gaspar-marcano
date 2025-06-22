const rateLimit = require('express-rate-limit');

// Mapa en memoria para llevar el historial de bloqueos por IP
const penaltyMap = new Map();

function getPenalty(ip) {
    const now = Date.now();
    let data = penaltyMap.get(ip);
    if (!data) {
        data = { count: 0, lastPenalty: 0 };
    }
    // Si ya pasó el último bloqueo, reiniciar
    if (now - data.lastPenalty > 15 * 60 * 1000) {
        data.count = 0;
    }
    let penalty;
    if (data.count === 0) penalty = 30 * 1000; // 30s
    else if (data.count === 1) penalty = 60 * 1000; // 1min
    else if (data.count === 2) penalty = 5 * 60 * 1000; // 5min
    else penalty = 15 * 60 * 1000; // 15min
    return { penalty, data };
}

const loginRateLimiter = rateLimit({
    windowMs: 30 * 1000, // 30 segundos para el primer ciclo
    max: 5, // Máximo de 5 intentos de inicio de sesión por IP
    handler: (req, res, next) => {
        const ip = req.ip;
        let { penalty, data } = getPenalty(ip);
        data.count += 1;
        data.lastPenalty = Date.now();
        penaltyMap.set(ip, data);
        let msg;
        if (data.count === 1) msg = 'Demasiados intentos. Espere 30 segundos.';
        else if (data.count === 2) msg = 'Demasiados intentos. Espere 1 minuto.';
        else if (data.count === 3) msg = 'Demasiados intentos. Espere 5 minutos.';
        else msg = 'Demasiados intentos. Espere 15 minutos.';
        res.set('Retry-After', Math.ceil(penalty / 1000));
        res.status(429).json({ message: msg });
    },
    keyGenerator: (req) => req.ip,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Solo cuenta los intentos fallidos
});

module.exports = { loginRateLimiter };
