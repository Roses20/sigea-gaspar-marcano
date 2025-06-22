// admin-historial-notas.js
// Consulta y muestra el historial de notas de un estudiante por ID

const API_URL = '/api/historial-notas';
const tbody = document.getElementById('notas-tbody');
const form = document.getElementById('busqueda-form');
const feedback = document.getElementById('form-feedback');
const tablaFeedback = document.getElementById('tabla-feedback');
const estudianteIdInput = document.getElementById('estudiante_id');

function mostrarFeedback(msg, ok = true) {
  feedback.textContent = msg;
  feedback.className = ok ? 'text-green-600' : 'text-red-600';
}
function mostrarTablaFeedback(msg, ok = true) {
  tablaFeedback.textContent = msg;
  tablaFeedback.className = ok ? 'text-green-600' : 'text-red-600';
}

let ultimoEstudianteId = null;
let ultimoHistorial = [];
let ultimoSortBy = null;
let ultimoOrder = 'asc';

function renderHistorial(historial) {
  tbody.innerHTML = '';
  historial.forEach(nota => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-4 py-2">${nota.materia?.nombre || ''}</td>
      <td class="px-4 py-2">${nota.periodo?.nombre || ''}</td>
      <td class="px-4 py-2">${nota.nota != null ? nota.nota : ''}</td>
      <td class="px-4 py-2">${nota.createdAt ? nota.createdAt.substring(0,10) : ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function cargarHistorial(estudiante_id, sortBy = null, order = 'asc') {
  tbody.innerHTML = '';
  mostrarTablaFeedback('Cargando...', true);
  try {
    let url = `${API_URL}/${estudiante_id}`;
    if (sortBy) url += `?sortBy=${sortBy}&order=${order}`;
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error('No se pudo obtener el historial');
    const historial = await res.json();
    if (!Array.isArray(historial) || historial.length === 0) {
      mostrarTablaFeedback('No hay notas registradas para este estudiante.', false);
      return;
    }
    ultimoEstudianteId = estudiante_id;
    ultimoHistorial = historial;
    ultimoSortBy = sortBy;
    ultimoOrder = order;
    renderHistorial(historial);
    mostrarTablaFeedback('', true);
  } catch (e) {
    mostrarTablaFeedback(e.message, false);
  }
}

// Ordenar por materia o nota
function ordenarPor(col) {
  let order = 'asc';
  if (ultimoSortBy === col && ultimoOrder === 'asc') order = 'desc';
  if (ultimoEstudianteId) cargarHistorial(ultimoEstudianteId, col, order);
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const estudiante_id = estudianteIdInput.value.trim();
  if (!estudiante_id) {
    mostrarFeedback('Debes ingresar un ID de estudiante.', false);
    return;
  }
  mostrarFeedback('', true);
  cargarHistorial(estudiante_id);
});

// Encabezados clicables
setTimeout(() => {
  const ths = document.querySelectorAll('thead th');
  if (ths[0]) ths[0].style.cursor = 'pointer';
  if (ths[2]) ths[2].style.cursor = 'pointer';
  if (ths[0]) ths[0].onclick = () => ordenarPor('materia');
  if (ths[2]) ths[2].onclick = () => ordenarPor('nota');
}, 500);
