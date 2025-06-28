const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../db/models');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Usuario.findOne({ where: { username } });
  if (!user) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  const token = jwt.sign({ id: user.id_usuario, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, usuario: { id: user.id_usuario, username: user.username, rol: user.rol } });
});

module.exports = router;
