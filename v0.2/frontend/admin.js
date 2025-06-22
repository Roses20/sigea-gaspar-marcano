// admin.js
// Mostrar datos del usuario logueado en las pantallas de admin

document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');
  const userEmail = localStorage.getItem('email');
  const userName = localStorage.getItem('username');
  const sessionTimestamp = localStorage.getItem('sessionTimestamp');
  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  // Si no hay sesión, redirigir al login
  if (!token || rol !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  // Expiración de sesión igual que otros roles
  if (!sessionTimestamp || now - Number(sessionTimestamp) > TEN_MINUTES) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('sessionTimestamp');
    window.location.href = 'login.html';
    return;
  }

  // Refrescar timestamp en cada acción del usuario
  document.body.addEventListener('mousemove', () => {
    localStorage.setItem('sessionTimestamp', Date.now());
  });
  document.body.addEventListener('keydown', () => {
    localStorage.setItem('sessionTimestamp', Date.now());
  });

  // Mostrar nombre/email en la barra superior
  const userNameElement = document.querySelector('.admin-username');
  if (userNameElement) {
    if (userName) {
      userNameElement.textContent = userName;
    } else if (userEmail) {
      userNameElement.textContent = userEmail;
    } else {
      userNameElement.textContent = 'Administrador';
    }
  }

  // Cerrar sesión
  const cerrarSesionBtns = document.querySelectorAll('.cerrar-sesion');
  cerrarSesionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('sessionTimestamp');
      window.location.replace('login.html');
    });
  });
});
