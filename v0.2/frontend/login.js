// login.js
// Script para manejar el inicio de sesión desde login.html

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.classList.add('hidden');
    errorDiv.textContent = '';

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Guardar token, usuario y timestamp en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('sessionTimestamp', Date.now());
        // Redirigir según el rol recibido
        if (data.usuario.rol === 'admin') {
          window.location.href = 'admin-inicio.html';
        } else if (data.usuario.rol === 'profesor') {
          window.location.href = 'profesor-inicio.html';
        } else if (data.usuario.rol === 'estudiante') {
          window.location.href = 'estudiante.html';
        } else {
          alert('Rol no reconocido.');
        }
      } else {
        errorDiv.textContent = data.message || 'Error al iniciar sesión';
        errorDiv.classList.remove('hidden');
      }
    } catch (err) {
      errorDiv.textContent = 'No se pudo conectar con el servidor';
      errorDiv.classList.remove('hidden');
    }
  });
});
