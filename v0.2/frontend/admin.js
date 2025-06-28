// admin.js
// Mostrar datos del usuario logueado en las pantallas de admin

document.addEventListener('DOMContentLoaded', function () {
  // Buscar datos en localStorage o sessionStorage
  function getSessionItem(key) {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }
  const token = getSessionItem('token');
  const rol = getSessionItem('rol');
  const userEmail = getSessionItem('email');
  const userName = getSessionItem('username');
  const sessionTimestamp = getSessionItem('sessionTimestamp');
  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  // Si no hay sesión, redirigir al login
  if (!token || rol !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  // Expiración de sesión igual que otros roles
  if (!sessionTimestamp || now - Number(sessionTimestamp) > TEN_MINUTES) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
    return;
  }

  // Refrescar timestamp en cada acción del usuario
  function refreshTimestamp() {
    if (localStorage.getItem('token')) {
      localStorage.setItem('sessionTimestamp', Date.now());
    } else {
      sessionStorage.setItem('sessionTimestamp', Date.now());
    }
  }
  document.body.addEventListener('mousemove', refreshTimestamp);
  document.body.addEventListener('keydown', refreshTimestamp);

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
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('login.html');
    });
  });

  // Eliminar referencias a periodos y secciones en menús si existen
});
