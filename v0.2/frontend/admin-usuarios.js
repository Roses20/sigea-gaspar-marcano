// admin-usuarios.js
// Cargar y mostrar todos los usuarios desde el backend

document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

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
    tbody.innerHTML = '';
    usuarios.forEach(usuario => {
      tbody.innerHTML += `
        <tr class="hover:bg-gray-100">
          <td class="border border-gray-300 px-4 py-2">${usuario.username || ''}</td>
          <td class="border border-gray-300 px-4 py-2">${usuario.rol || ''}</td>
          <td class="border border-gray-300 px-4 py-2">${usuario.email || ''}</td>
          <td class="border border-gray-300 px-4 py-2">${usuario.telefono || ''}</td>
          <td class="border border-gray-300 px-4 py-2 space-x-2">
            <button class="text-blue-600 hover:underline">Editar</button>
            <button class="text-red-600 hover:underline">Eliminar</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">${err.message}</td></tr>`;
  }
});
