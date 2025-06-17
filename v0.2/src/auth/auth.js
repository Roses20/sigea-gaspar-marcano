const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secretKey = process.env.JWT_SECRET || 'bendiciones0420.';

// Generar un token JWT
function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '10m' }); // Expira en 10 minutos
}

// Verificar un token JWT
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('Token inválido');
    }
}

// Encriptar una contraseña
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Comparar una contraseña con su hash
async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    comparePassword
};