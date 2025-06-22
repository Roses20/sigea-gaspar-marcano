// Lógica para mostrar datos del profesor logueado y cierre de sesión

document.addEventListener('DOMContentLoaded', () => {
  // Obtener datos del usuario logueado desde localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Si no hay usuario, redirigir a login
  if (!usuario || usuario.rol !== 'profesor') {
    window.location.href = 'login.html';
    return;
  }

  // Mostrar nombre y correo en la barra superior y bienvenida
  const nombre = usuario.nombre || '';
  const correo = usuario.email || '';
  const barra = document.querySelector('.profesor-username');
  const bienvenida = document.querySelector('.profesor-bienvenida');

  if (barra) {
    barra.textContent = nombre && correo ? `${nombre} (${correo})` : nombre || correo;
  }
  if (bienvenida) {
    bienvenida.textContent = nombre && correo ? `${nombre} (${correo})` : nombre || correo;
  }

  // Mostrar datos personales en el perfil
  const nombreSpan = document.querySelector('.profesor-nombre');
  const apellidoSpan = document.querySelector('.profesor-apellido');
  const cedulaSpan = document.querySelector('.profesor-cedula');
  const correoSpan = document.querySelector('.profesor-correo');
  const telefonoSpan = document.querySelector('.profesor-telefono');
  const direccionSpan = document.querySelector('.profesor-direccion');
  // Los datos pueden estar en el objeto usuario o requerir una consulta adicional si no están completos
  if (nombreSpan) nombreSpan.textContent = usuario.nombre || '-';
  if (apellidoSpan) apellidoSpan.textContent = usuario.apellido || '-';
  if (cedulaSpan) cedulaSpan.textContent = usuario.cedula || '-';
  if (correoSpan) correoSpan.textContent = usuario.email || '-';
  if (telefonoSpan) telefonoSpan.textContent = usuario.telefono || '-';
  if (direccionSpan) direccionSpan.textContent = usuario.direccion || '-';

  // --- Edición de datos personales ---
  const btnEditar = document.getElementById('editar-datos-profesor');
  const btnGuardar = document.getElementById('guardar-datos-profesor');
  const btnCancelar = document.getElementById('cancelar-edicion-profesor');
  const camposEditables = [
    document.querySelector('.profesor-nombre'),
    document.querySelector('.profesor-apellido'),
    document.querySelector('.profesor-cedula'),
    document.querySelector('.profesor-correo'),
    document.querySelector('.profesor-telefono'),
    document.querySelector('.profesor-direccion')
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
        apellido: camposEditables[1]?.value || '',
        cedula: camposEditables[2]?.value || '',
        email: camposEditables[3]?.value || '',
        telefono: camposEditables[4]?.value || '',
        direccion: camposEditables[5]?.value || ''
      };
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/profesores/${usuario.id}`, {
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

  // Cierre de sesión para todos los botones
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
