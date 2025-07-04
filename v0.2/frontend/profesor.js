// Lógica para mostrar datos del profesor logueado y cierre de sesión

document.addEventListener('DOMContentLoaded', () => {
  // Buscar datos en localStorage o sessionStorage
  function getSessionItem(key) {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }
  const usuario = JSON.parse(getSessionItem('usuario'));
  const sessionTimestamp = getSessionItem('sessionTimestamp');
  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  // Si no hay usuario o no es profesor, redirigir a login
  if (!usuario || usuario.rol !== 'profesor') {
    window.location.href = 'login.html';
    return;
  }

  // Verificar expiración de sesión (10 minutos)
  if (!sessionTimestamp || now - Number(sessionTimestamp) > TEN_MINUTES) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
    return;
  }

  // Refrescar timestamp en cada acción del usuario
  function refreshTimestamp() {
    if (localStorage.getItem('usuario')) {
      localStorage.setItem('sessionTimestamp', Date.now());
    } else {
      sessionStorage.setItem('sessionTimestamp', Date.now());
    }
  }
  document.body.addEventListener('mousemove', refreshTimestamp);
  document.body.addEventListener('keydown', refreshTimestamp);

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
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('login.html');
    });
  });

  // Cambios: Adaptar para mostrar y consumir id_profesor y materias desde el endpoint REST actualizado
  // Ejemplo de consulta de materias del profesor:
  async function cargarMateriasProfesor() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.id_profesor) return;
    try {
      const res = await fetch(`/api/profesores/${usuario.id_profesor}/materias`);
      if (!res.ok) throw new Error('No se pudieron cargar las materias');
      const materias = await res.json();
      // Renderizar materias en la tabla o lista correspondiente
      // ...
    } catch (e) {
      // Mostrar error
    }
  }

  // Llamar a la función para cargar materias al iniciar
  cargarMateriasProfesor();
});
