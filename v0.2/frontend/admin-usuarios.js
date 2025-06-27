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
    const response = await fetch('http://localhost:3000/api/usuario', {
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
    tbody.innerHTML += `
      <tr class="hover:bg-gray-100">
        <td class="border border-gray-300 px-4 py-2">${usuario.username || ''}</td>
        <td class="border border-gray-300 px-4 py-2">${usuario.rol || ''}</td>
        <td class="border border-gray-300 px-4 py-2">${usuario.email || ''}</td>
        <td class="border border-gray-300 px-4 py-2">${usuario.telefono || ''}</td>
        <td class="border border-gray-300 px-4 py-2 space-x-2">
          <button class="text-blue-600 hover:underline" onclick="editarUsuario(${usuario.id})">Editar</button>
          <button class="text-red-600 hover:underline" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
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
    const res = await fetch(`/api/usuario/${id}`, { credentials: 'include' });
    if (!res.ok) throw new Error('No se pudo obtener el usuario');
    const usuario = await res.json();
    const nuevoUsername = prompt('Nuevo nombre de usuario:', usuario.username);
    if (nuevoUsername === null) return;
    const nuevoEmail = prompt('Nuevo email:', usuario.email);
    if (nuevoEmail === null) return;
    const nuevoTelefono = prompt('Nuevo teléfono:', usuario.telefono);
    if (nuevoTelefono === null) return;
    const nuevoRol = prompt('Nuevo rol (estudiante, profesor, admin):', usuario.rol);
    if (nuevoRol === null) return;
    const body = { username: nuevoUsername, email: nuevoEmail, telefono: nuevoTelefono, rol: nuevoRol };
    const putRes = await fetch(`/api/usuario/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });
    if (!putRes.ok) throw new Error('No se pudo actualizar');
    cargarUsuarios();
  } catch (e) {
    alert(e.message);
  }
};
