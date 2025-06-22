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
    if (!Array.isArray(materias) || materias.length === 0) {
      mostrarTablaFeedback('No hay materias registradas.', false);
      return;
    }
    materias.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-4 py-2">${m.codigo_materia}</td>
        <td class="px-4 py-2">${m.nombre}</td>
        <td class="px-4 py-2">${m.anio}</td>
        <td class="px-4 py-2 flex gap-2">
          <button class="bg-yellow-400 px-2 py-1 rounded text-xs" onclick="editarMateria('${m.codigo_materia}', '${m.nombre.replace(/'/g, "\\'")}', ${m.anio})">Editar</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded text-xs" onclick="eliminarMateria('${m.codigo_materia}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    mostrarTablaFeedback('', true);
  } catch (e) {
    mostrarTablaFeedback(e.message, false);
  }
}

window.editarMateria = function(id, nombre, anio) {
  editando = true;
  idInput.value = id;
  nombreInput.value = nombre;
  codigoInput.value = anio;
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
  cancelarBtn.classList.add('hidden');
  mostrarFeedback('', true);
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = nombreInput.value.trim();
  const anio = codigoInput.value.trim();
  if (!nombre || !anio) {
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
        body: JSON.stringify({ nombre, anio })
      });
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre, anio })
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

// Inicializar
cargarMaterias();
