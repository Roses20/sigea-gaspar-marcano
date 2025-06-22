// Redirige automáticamente según el rol si ya hay sesión iniciada
// Soporta localStorage (recuérdame) y sessionStorage (sesión temporal)
document.addEventListener('DOMContentLoaded', function () {
  let storage = localStorage.getItem('token') ? localStorage : sessionStorage;
  let token = storage.getItem('token');
  let rol = storage.getItem('rol');
  let timestamp = storage.getItem('sessionTimestamp');
  const SESSION_DURATION = 10 * 60 * 1000; // 10 minutos en ms
  const WARNING_TIME = 1 * 60 * 1000; // 1 minuto en ms

  function showFloatingMessage(msg, color = '#fbbf24', textColor = '#222') {
    let div = document.getElementById('session-floating-msg');
    if (!div) {
      div = document.createElement('div');
      div.id = 'session-floating-msg';
      div.style.position = 'fixed';
      div.style.top = '30px';
      div.style.left = '30px';
      div.style.background = color;
      div.style.color = textColor;
      div.style.padding = '16px 24px';
      div.style.borderRadius = '8px';
      div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      div.style.zIndex = 9999;
      div.style.fontWeight = 'bold';
      div.style.maxWidth = '350px';
      div.style.fontSize = '1rem';
      div.style.opacity = '0.97';
      document.body.appendChild(div);
    }
    div.textContent = msg;
    div.style.display = 'block';
  }

  function hideFloatingMessage() {
    const div = document.getElementById('session-floating-msg');
    if (div) div.style.display = 'none';
  }

  function showWarning() {
    showFloatingMessage('⚠️ Tu sesión expirará en 1 minuto. Guarda tu trabajo.');
  }

  function showExpired() {
    showFloatingMessage('⏰ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', '#ef4444', '#fff');
    setTimeout(() => {
      hideFloatingMessage();
      window.location.href = 'login.html';
    }, 2000);
  }

  if (token && rol && timestamp) {
    const now = Date.now();
    const elapsed = now - parseInt(timestamp, 10);
    if (elapsed < SESSION_DURATION) {
      // Advertencia al faltar 1 minuto
      if (SESSION_DURATION - elapsed <= WARNING_TIME) {
        showWarning();
      } else {
        setTimeout(showWarning, SESSION_DURATION - elapsed - WARNING_TIME);
      }
      // Redirección automática al expirar
      setTimeout(() => {
        storage.removeItem('token');
        storage.removeItem('usuario');
        storage.removeItem('sessionTimestamp');
        storage.removeItem('rol');
        storage.removeItem('email');
        storage.removeItem('username');
        showExpired();
      }, SESSION_DURATION - elapsed);
      // Redirigir por rol si aún es válido
      if (rol === 'admin') {
        window.location.href = 'admin-inicio.html';
      } else if (rol === 'profesor') {
        window.location.href = 'profesor-inicio.html';
      } else if (rol === 'estudiante') {
        window.location.href = 'estudiante-inicio.html';
      }
    } else {
      // Sesión expirada
      storage.removeItem('token');
      storage.removeItem('usuario');
      storage.removeItem('sessionTimestamp');
      storage.removeItem('rol');
      storage.removeItem('email');
      storage.removeItem('username');
      showExpired();
    }
  }
});
