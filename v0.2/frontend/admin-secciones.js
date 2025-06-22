// admin-secciones.js
// Funcionalidad para administrar secciones (listado, crear, editar, eliminar)

const API_URL = '/api/secciones';
const tbody = document.getElementById('secciones-tbody');
const form = document.getElementById('seccion-form');
const feedback = document.getElementById('form-feedback');
const tablaFeedback = document.getElementById('tabla-feedback');
const cancelarBtn = document.getElementById('cancelar-edicion');
const idInput = document.getElementById('seccion-id');
const nombreInput = document.getElementById('nombre');
const periodoIdInput = document.getElementById('periodo_id');

let editando = false;

function mostrarFeedback(msg, ok = true) {
  feedback.textContent = msg;
  feedback.className = ok ? 'text-green-600' : 'text-red-600';
}
function mostrarTablaFeedback(msg, ok = true) {
  tablaFeedback.textContent = msg;
  tablaFeedback.className = ok ? 'text-green-600' : 'text-red-600';
}

async function cargarSecciones() {
  tbody.innerHTML = '';
  mostrarTablaFeedback('Cargando...', true);
  try {
    const res = await fetch(API_URL, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al cargar secciones');
    const secciones = await res.json();
    if (!Array.isArray(secciones) || secciones.length === 0) {
      mostrarTablaFeedback('No hay secciones registradas.', false);
      return;
    }
    secciones.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-4 py-2">${s.id}</td>
        <td class="px-4 py-2">${s.nombre}</td>
        <td class="px-4 py-2">${s.periodo_id}</td>
        <td class="px-4 py-2 flex gap-2">
          <button class="bg-yellow-400 px-2 py-1 rounded text-xs" onclick="editarSeccion(${s.id}, '${s.nombre.replace(/'/g, "\\'")}', ${s.periodo_id})">Editar</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded text-xs" onclick="eliminarSeccion(${s.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    mostrarTablaFeedback('', true);
  } catch (e) {
    mostrarTablaFeedback(e.message, false);
  }
}

window.editarSeccion = function(id, nombre, periodo_id) {
  editando = true;
  idInput.value = id;
  nombreInput.value = nombre;
  periodoIdInput.value = periodo_id;
  cancelarBtn.classList.remove('hidden');
  mostrarFeedback('Editando sección ID ' + id, true);
};

window.eliminarSeccion = async function(id) {
  if (!confirm('¿Eliminar esta sección?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('No se pudo eliminar');
    mostrarTablaFeedback('Sección eliminada.', true);
    cargarSecciones();
  } catch (e) {
    mostrarTablaFeedback(e.message, false);
  }
};

cancelarBtn.addEventListener('click', () => {
  editando = false;
  idInput.value = '';
  nombreInput.value = '';
  periodoIdInput.value = '';
  cancelarBtn.classList.add('hidden');
  mostrarFeedback('', true);
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = nombreInput.value.trim();
  const periodo_id = periodoIdInput.value;
  if (!nombre || !periodo_id) {
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
        body: JSON.stringify({ nombre, periodo_id })
      });
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre, periodo_id })
      });
    }
    if (!res.ok) throw new Error('Error al guardar');
    mostrarFeedback('Guardado correctamente.', true);
    form.reset();
    cancelarBtn.classList.add('hidden');
    editando = false;
    cargarSecciones();
  } catch (e) {
    mostrarFeedback(e.message, false);
  }
});

// Inicializar
cargarSecciones();
