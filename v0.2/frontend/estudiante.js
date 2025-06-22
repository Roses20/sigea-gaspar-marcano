// Script para mostrar datos del estudiante logueado y gestionar cierre de sesión

document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const sessionTimestamp = localStorage.getItem('sessionTimestamp');
  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  // Si no hay usuario o no es estudiante, redirigir a login
  if (!usuario || usuario.rol !== 'estudiante') {
    window.location.href = 'login.html';
    return;
  }

  // Verificar expiración de sesión (10 minutos)
  if (!sessionTimestamp || now - Number(sessionTimestamp) > TEN_MINUTES) {
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

  // Barra superior y bienvenida
  const barra = document.querySelector('.estudiante-username');
  const bienvenida = document.querySelector('.estudiante-bienvenida');
  if (barra) {
    barra.textContent = usuario.nombre ? usuario.nombre : usuario.email;
  }
  if (bienvenida) {
    bienvenida.textContent = usuario.nombre ? usuario.nombre : usuario.email;
  }

  // Perfil (si existe)
  const nombreCompleto = document.querySelector('.estudiante-nombre');
  const correo = document.querySelector('.estudiante-correo');
  const telefono = document.querySelector('.estudiante-telefono');
  if (nombreCompleto) nombreCompleto.textContent = usuario.nombreCompleto || usuario.nombre || '';
  if (correo) correo.textContent = usuario.email || '';
  if (telefono) telefono.textContent = usuario.telefono || '';

  // Cierre de sesión para todos los botones
  const cerrarSesionBtns = document.querySelectorAll('.cerrar-sesion');
  cerrarSesionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      localStorage.removeItem('usuario');
      localStorage.removeItem('sessionTimestamp');
      window.location.replace('login.html');
    });
  });

  // --- Edición de datos personales ---
  const btnEditar = document.getElementById('editar-datos');
  const btnGuardar = document.getElementById('guardar-datos');
  const btnCancelar = document.getElementById('cancelar-edicion');
  const camposEditables = [
    document.querySelector('.estudiante-nombre'),
    document.querySelector('.estudiante-correo'),
    document.querySelector('.estudiante-telefono'),
    document.querySelector('.estudiante-ano'),
    document.querySelector('.estudiante-seccion'),
    document.querySelector('.estudiante-direccion'),
    document.querySelector('.estudiante-fecha')
  ];

  if (btnEditar && btnGuardar && btnCancelar) {
    btnEditar.addEventListener('click', () => {
      camposEditables.forEach(campo => campo && (campo.disabled = false));
      btnEditar.classList.add('hidden');
      btnGuardar.classList.remove('hidden');
      btnCancelar.classList.remove('hidden');
    });
    btnCancelar.addEventListener('click', () => {
      window.location.reload();
    });
    btnGuardar.addEventListener('click', async () => {
      // Recopilar datos con nombres correctos para el backend
      const datos = {
        nombre: camposEditables[0]?.value || '',
        email: camposEditables[1]?.value || '',
        telefono: camposEditables[2]?.value || '',
        anio: camposEditables[3]?.value || '',
        seccion: camposEditables[4]?.value || '',
        direccion: camposEditables[5]?.value || '',
        fecha_nacimiento: camposEditables[6]?.value || ''
      };
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/estudiantes/perfil', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(datos)
        });
        if (response.ok) {
          alert('Datos actualizados correctamente.');
          window.location.reload();
        } else {
          const error = await response.json();
          alert('Error al actualizar: ' + (error.message || JSON.stringify(error)));
        }
      } catch (err) {
        alert('Error de red o servidor: ' + err.message);
      }
    });
  }
});
