// admin-usuarios.js
// Cargar y mostrar todos los usuarios desde el backend

document.addEventListener('DOMContentLoaded', async function () {
  // Buscar datos en localStorage o sessionStorage
  function getSessionItem(key) {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }
  const token = getSessionItem('token');
  const rol = getSessionItem('rol');
  const sessionTimestamp = getSessionItem('sessionTimestamp');
  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  if (!token || rol !== 'admin') {
    window.location.href = 'login.html';
    return;
  }
  if (!sessionTimestamp || now - Number(sessionTimestamp) > TEN_MINUTES) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
    return;
  }
  function refreshTimestamp() {
    if (localStorage.getItem('token')) {
      localStorage.setItem('sessionTimestamp', Date.now());
    } else {
      sessionStorage.setItem('sessionTimestamp', Date.now());
    }
  }
  document.body.addEventListener('mousemove', refreshTimestamp);
  document.body.addEventListener('keydown', refreshTimestamp);

  const tbody = document.querySelector('table tbody');
  tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">Cargando usuarios...</td></tr>';

  try {
    // Cambia la URL para que coincida con la ruta del backend
    const response = await fetch('http://localhost:3000/api/usuarios', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    if (!response.ok) throw new Error('No se pudo obtener la lista de usuarios');
    const usuarios = await response.json();
    if (usuarios.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">No hay usuarios registrados.</td></tr>';
      return;
    }
    renderUsuarios(usuarios);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">${err.message}</td></tr>`;
  }
});

function renderUsuarios(usuarios) {
  const tbody = document.querySelector('table tbody');
  tbody.innerHTML = '';
  usuarios.forEach(usuario => {
    // Determinar si es estudiante o profesor
    let nombre = '';
    let correo = '';
    let telefono = '';
    let idEstudiante = '';
    let idProfesor = '';
    if (usuario.estudiante) {
      nombre = `${usuario.estudiante.nombres} ${usuario.estudiante.apellidos}`;
      correo = usuario.estudiante.email || '';
      telefono = usuario.estudiante.telefono || '';
      idEstudiante = usuario.estudiante.id_estudiante;
    } else if (usuario.profesor) {
      nombre = `${usuario.profesor.nombres} ${usuario.profesor.apellidos}`;
      correo = usuario.profesor.email || '';
      telefono = usuario.profesor.telefono || '';
      idProfesor = usuario.profesor.id_profesor;
    } else {
      nombre = usuario.username || '';
    }
    tbody.innerHTML += `
      <tr>
        <td>${nombre}</td>
        <td>${usuario.rol}</td>
        <td>${correo}</td>
        <td>${telefono}</td>
        <td>${idEstudiante || '-'}</td>
        <td>${idProfesor || '-'}</td>
        <td>
          <button onclick="editarUsuario(${usuario.id_usuario})" class="text-blue-600 hover:underline transition-btn">Editar</button>
          <button onclick="eliminarUsuario(${usuario.id_usuario})" class="text-red-600 hover:underline transition-btn">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

async function cargarUsuarios() {
  const tbody = document.querySelector('table tbody');
  tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">Cargando usuarios...</td></tr>';
  try {
    const response = await fetch('/api/usuario', {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('No se pudo obtener la lista de usuarios');
    const usuarios = await response.json();
    if (usuarios.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">No hay usuarios registrados.</td></tr>';
      return;
    }
    renderUsuarios(usuarios);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">${err.message}</td></tr>`;
  }
}

window.eliminarUsuario = async function(id) {
  if (!confirm('¿Eliminar este usuario?')) return;
  try {
    const res = await fetch(`/api/usuario/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('No se pudo eliminar');
    cargarUsuarios();
  } catch (e) {
    alert(e.message);
  }
};

window.editarUsuario = async function(id) {
  try {
    const res = await fetch(`/api/usuarios/${id}`);
    if (!res.ok) throw new Error('No se pudo obtener el usuario');
    const usuario = await res.json();
    const nuevoUsername = prompt('Nuevo nombre de usuario:', usuario.username);
    if (nuevoUsername === null) return;
    const nuevoRol = prompt('Nuevo rol (estudiante, profesor):', usuario.rol);
    if (nuevoRol === null || nuevoRol === 'admin') {
      alert('No está permitido cambiar a rol administrador.');
      return;
    }
    // No se permite editar el ID, solo nombre y rol
    const body = { username: nuevoUsername, rol: nuevoRol };
    const putRes = await fetch(`/api/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!putRes.ok) throw new Error('No se pudo actualizar');
    cargarUsuarios();
  } catch (e) {
    alert(e.message);
  }
};

// Refrescar la lista de usuarios cada 5 segundos
globalThis._usuariosInterval = setInterval(() => {
  // Solo recargar si la página está visible
  if (!document.hidden) {
    const tbody = document.querySelector('table tbody');
    if (tbody) {
      // Llama a la función de carga principal
      document.dispatchEvent(new Event('DOMContentLoaded'));
    }
  }
}, 5000);
