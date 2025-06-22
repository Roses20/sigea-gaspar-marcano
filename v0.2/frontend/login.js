// login.js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    // Limpiar mensajes previos
    errorDiv.classList.add('hidden');
    errorDiv.textContent = '';
    emailError.classList.add('hidden');
    emailError.textContent = '';
    passwordError.classList.add('hidden');
    passwordError.textContent = '';
    document.getElementById('email').classList.remove('border-red-500');
    document.getElementById('password').classList.remove('border-red-500');
    // Obtener el estado del checkbox 'Recuérdame'
    const rememberMe = document.querySelector('input[type="checkbox"]:not(#toggle-password)').checked;

    // Cerrar sesión anterior si existe
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('sessionTimestamp');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('sessionTimestamp');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');

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
        // Guardar token, usuario y timestamp según 'Recuérdame'
        if (rememberMe) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('usuario', JSON.stringify(data.usuario));
          localStorage.setItem('sessionTimestamp', Date.now());
          localStorage.setItem('rol', data.usuario.rol);
          localStorage.setItem('email', data.usuario.email);
          localStorage.setItem('username', data.usuario.username);
        } else {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
          sessionStorage.setItem('sessionTimestamp', Date.now());
          sessionStorage.setItem('rol', data.usuario.rol);
          sessionStorage.setItem('email', data.usuario.email);
          sessionStorage.setItem('username', data.usuario.username);
        }
        // Redirigir según el rol recibido
        const redirectByRole = () => {
          if (data.usuario.rol === 'admin') {
            window.location.href = 'admin-inicio.html';
          } else if (data.usuario.rol === 'profesor') {
            window.location.href = 'profesor-inicio.html';
          } else if (data.usuario.rol === 'estudiante') {
            window.location.href = 'estudiante-inicio.html';
          } else {
            alert('Rol no reconocido.');
          }
        };
        if (rememberMe) {
          redirectByRole();
        } else {
          setTimeout(redirectByRole, 600); // Retardo visual para sesión temporal
        }
      } else {
        // Mostrar errores específicos
        if (data.message && data.message.toLowerCase().includes('usuario no encontrado')) {
          emailError.textContent = 'Correo electrónico no registrado o inválido.';
          emailError.classList.remove('hidden');
          document.getElementById('email').classList.add('border-red-500');
        } else if (data.message && data.message.toLowerCase().includes('contraseña incorrecta')) {
          passwordError.textContent = 'Contraseña incorrecta.';
          passwordError.classList.remove('hidden');
          document.getElementById('password').classList.add('border-red-500');
        } else if (data.message && data.message.toLowerCase().includes('email')) {
          emailError.textContent = data.message;
          emailError.classList.remove('hidden');
          document.getElementById('email').classList.add('border-red-500');
        } else if (data.message && data.message.toLowerCase().includes('password')) {
          passwordError.textContent = data.message;
          passwordError.classList.remove('hidden');
          document.getElementById('password').classList.add('border-red-500');
        } else {
          errorDiv.textContent = data.message || 'Error al iniciar sesión';
          errorDiv.classList.remove('hidden');
        }
      }
    } catch (err) {
      errorDiv.textContent = 'No se pudo conectar con el servidor';
      errorDiv.classList.remove('hidden');
    }
  });
});
