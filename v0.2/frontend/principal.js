// Redirige automáticamente según el rol si ya hay sesión iniciada
document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');
  if (token && rol) {
    if (rol === 'admin') {
      window.location.href = 'admin-inicio.html';
    } else if (rol === 'profesor') {
      window.location.href = 'profesor-inicio.html';
    } else if (rol === 'estudiante') {
      window.location.href = 'estudiante.html';
    }
  }
});
