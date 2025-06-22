// Script para crear el usuario admin principal en la tabla usuario
// Ejecutar con: node scripts/crear_admin.js

const bcrypt = require('bcryptjs');
const sequelize = require('../libs/sequelize');
const { Usuario } = require('../db/models/usuario.model');

async function crearAdmin() {
  const username = 'control-estudio';
  const email = 'admin@gmail.com';
  const password = 'gasparino123.';
  const rol = 'admin';

  const hash = await bcrypt.hash(password, 10);

  // Verifica si ya existe
  const existe = await Usuario.findOne({ where: { username } });
  if (existe) {
    console.log('El usuario admin ya existe.');
    process.exit(0);
  }

  await Usuario.create({
    username,
    email,
    password: hash,
    rol
  });
  console.log('Usuario admin creado correctamente.');
  process.exit(0);
}

crearAdmin().catch(e => { console.error(e); process.exit(1); });
