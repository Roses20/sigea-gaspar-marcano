// admin-materias.js
// Funcionalidad para administrar materias (listado, crear, editar, eliminar)

const API_URL = '/api/materias';
const tbody = document.getElementById('materias-tbody');
const form = document.getElementById('materia-form');
const feedback = document.getElementById('form-feedback');
const tablaFeedback = document.getElementById('tabla-feedback');
const cancelarBtn = document.getElementById('cancelar-edicion');
const idInput = document.getElementById('materia-id');
const nombreInput = document.getElementById('nombre');
const codigoInput = document.getElementById('codigo');
const nivelInput = document.getElementById('nivel');

let editando = false;

function mostrarFeedback(msg, ok = true) {
  feedback.textContent = msg;
  feedback.className = ok ? 'text-green-600' : 'text-red-600';
}
function mostrarTablaFeedback(msg, ok = true) {
  tablaFeedback.textContent = msg;
  tablaFeedback.className = ok ? 'text-green-600' : 'text-red-600';
}

async function cargarMaterias() {
  tbody.innerHTML = '';
  mostrarTablaFeedback('Cargando...', true);
  try {
    const res = await fetch(API_URL, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al cargar materias');
    const materias = await res.json();
    alert('Respuesta cruda del backend: ' + JSON.stringify(materias));
    console.log('Materias recibidas (crudo):', materias); // <-- Depuración fuerte
    if (!Array.isArray(materias) || materias.length === 0) {
      mostrarTablaFeedback('No hay materias registradas o la respuesta es inválida.', false);
      return;
    }
    tbody.innerHTML = '';
    materias.forEach(m => {
      // Asegurarse de que id_materia es un entero y existe
      const idMateria = Number(m.id_materia);
      console.log('Materia:', m, 'ID:', idMateria, 'typeof:', typeof idMateria); // Depuración mejorada
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-4 py-2">${Number.isInteger(idMateria) ? idMateria : ''}</td>
        <td class="px-4 py-2">${m.nombre}</td>
        <td class="px-4 py-2">${m.codigo}</td>
        <td class="px-4 py-2">${m.nivel || ''}</td>
        <td class="px-4 py-2 flex gap-2">
          <button class="bg-yellow-400 px-2 py-1 rounded text-xs" onclick="editarMateria(${idMateria}, '${m.nombre.replace(/'/g, "\\'")}', '${m.codigo.replace(/'/g, "\\'")}', '${(m.nivel || '').replace(/'/g, "\\'")}' )">Editar</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded text-xs" onclick="eliminarMateria(${idMateria})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    mostrarTablaFeedback('', true);
  } catch (e) {
    mostrarTablaFeedback(e.message, false);
  }
}

window.editarMateria = function(id, nombre, codigo, nivel) {
  editando = true;
  idInput.value = id;
  nombreInput.value = nombre;
  codigoInput.value = codigo;
  nivelInput.value = nivel;
  cancelarBtn.classList.remove('hidden');
  mostrarFeedback('Editando materia ID ' + id, true);
};

window.eliminarMateria = async function(id) {
  if (!confirm('¿Eliminar esta materia?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('No se pudo eliminar');
    mostrarTablaFeedback('Materia eliminada.', true);
    cargarMaterias();
  } catch (e) {
    mostrarTablaFeedback(e.message, false);
  }
};

cancelarBtn.addEventListener('click', () => {
  editando = false;
  idInput.value = '';
  nombreInput.value = '';
  codigoInput.value = '';
  nivelInput.value = '';
  cancelarBtn.classList.add('hidden');
  mostrarFeedback('', true);
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = nombreInput.value.trim();
  const codigo = codigoInput.value.trim();
  const nivel = nivelInput.value.trim();
  if (!nombre || !codigo || !nivel) {
    mostrarFeedback('Todos los campos son obligatorios.', false);
    return;
  }
  try {
    let res;
    if (editando && idInput.value) {
      res = await fetch(`${API_URL}/${idInput.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre, codigo, nivel })
      });
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre, codigo, nivel })
      });
    }
    if (!res.ok) throw new Error('Error al guardar');
    mostrarFeedback('Guardado correctamente.', true);
    form.reset();
    cancelarBtn.classList.add('hidden');
    editando = false;
    cargarMaterias();
  } catch (e) {
    mostrarFeedback(e.message, false);
  }
});

document.addEventListener('DOMContentLoaded', function () {
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

  // Cargar materias al iniciar
  cargarMaterias();
});
