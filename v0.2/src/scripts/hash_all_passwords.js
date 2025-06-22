// Script para hashear todas las contraseñas de usuarios que no estén hasheadas
const { models } = require('../libs/sequelize');
const { hashPassword } = require('../auth/auth');

async function isHashed(password) {
  // bcrypt hashes start with $2a$ o $2b$
  return password.startsWith('$2a$') || password.startsWith('$2b$');
}

async function main() {
  const usuarios = await models.Usuario.findAll();
  for (const usuario of usuarios) {
    if (!(await isHashed(usuario.password))) {
      const hashed = await hashPassword(usuario.password);
      usuario.password = hashed;
      await usuario.save();
      console.log(`Contraseña hasheada para usuario: ${usuario.email || usuario.username}`);
    } else {
      console.log(`Contraseña ya hasheada para usuario: ${usuario.email || usuario.username}`);
    }
  }
  console.log('Proceso completado.');
  process.exit(0);
}

main().catch(err => {
  console.error('Error al hashear contraseñas:', err);
  process.exit(1);
});
