// admin-periodos.js
// Funcionalidad para administrar periodos (listado, crear, editar, eliminar)

const API_URL = '/api/periodos';
const tbody = document.getElementById('periodos-tbody');
const form = document.getElementById('periodo-form');
const feedback = document.getElementById('form-feedback');
const tablaFeedback = document.getElementById('tabla-feedback');
const cancelarBtn = document.getElementById('cancelar-edicion');
const idInput = document.getElementById('periodo-id');
const nombreInput = document.getElementById('nombre');
const fechaInicioInput = document.getElementById('fecha_inicio');
const fechaFinInput = document.getElementById('fecha_fin');

let editando = false;

function mostrarFeedback(msg, ok = true) {
  feedback.textContent = msg;
  feedback.className = ok ? 'text-green-600' : 'text-red-600';
}
function mostrarTablaFeedback(msg, ok = true) {
  tablaFeedback.textContent = msg;
  tablaFeedback.className = ok ? 'text-green-600' : 'text-red-600';
}

async function cargarPeriodos() {
  tbody.innerHTML = '';
  mostrarTablaFeedback('Cargando...', true);
  try {
    const res = await fetch(API_URL, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al cargar periodos');
    const periodos = await res.json();
    if (!Array.isArray(periodos) || periodos.length === 0) {
      mostrarTablaFeedback('No hay periodos registrados.', false);
      return;
    }
    periodos.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-4 py-2">${p.id}</td>
        <td class="px-4 py-2">${p.nombre}</td>
        <td class="px-4 py-2">${p.fecha_inicio ? p.fecha_inicio.substring(0,10) : ''}</td>
        <td class="px-4 py-2">${p.fecha_fin ? p.fecha_fin.substring(0,10) : ''}</td>
        <td class="px-4 py-2 flex gap-2">
          <button class="bg-yellow-400 px-2 py-1 rounded text-xs" onclick="editarPeriodo(${p.id}, '${p.nombre.replace(/'/g, "\\'")}', '${p.fecha_inicio}', '${p.fecha_fin}')">Editar</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded text-xs" onclick="eliminarPeriodo(${p.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    mostrarTablaFeedback('', true);
  } catch (e) {
    mostrarTablaFeedback(e.message, false);
  }
}

window.editarPeriodo = function(id, nombre, fecha_inicio, fecha_fin) {
  editando = true;
  idInput.value = id;
  nombreInput.value = nombre;
  fechaInicioInput.value = fecha_inicio ? fecha_inicio.substring(0,10) : '';
  fechaFinInput.value = fecha_fin ? fecha_fin.substring(0,10) : '';
  cancelarBtn.classList.remove('hidden');
  mostrarFeedback('Editando periodo ID ' + id, true);
};

window.eliminarPeriodo = async function(id) {
  if (!confirm('¿Eliminar este periodo?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('No se pudo eliminar');
    mostrarTablaFeedback('Periodo eliminado.', true);
    cargarPeriodos();
  } catch (e) {
    mostrarTablaFeedback(e.message, false);
  }
};

cancelarBtn.addEventListener('click', () => {
  editando = false;
  idInput.value = '';
  nombreInput.value = '';
  fechaInicioInput.value = '';
  fechaFinInput.value = '';
  cancelarBtn.classList.add('hidden');
  mostrarFeedback('', true);
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = nombreInput.value.trim();
  const fecha_inicio = fechaInicioInput.value;
  const fecha_fin = fechaFinInput.value;
  if (!nombre || !fecha_inicio || !fecha_fin) {
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
        body: JSON.stringify({ nombre, fecha_inicio, fecha_fin })
      });
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre, fecha_inicio, fecha_fin })
      });
    }
    if (!res.ok) throw new Error('Error al guardar');
    mostrarFeedback('Guardado correctamente.', true);
    form.reset();
    cancelarBtn.classList.add('hidden');
    editando = false;
    cargarPeriodos();
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

  // Cargar periodos al iniciar
  cargarPeriodos();
});
