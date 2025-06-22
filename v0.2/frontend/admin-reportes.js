// admin-reportes.js
// Conexión y formato simple para reportes de asistencia, rendimiento y usuarios

document.addEventListener('DOMContentLoaded', () => {
  // Botones de reporte (solo los de la sección de reportes, no del menú)
  const main = document.querySelector('main');
  if (!main) return;
  const botones = main.querySelectorAll('button');
  if (botones[0]) botones[0].onclick = mostrarReporteAsistencia;
  if (botones[1]) botones[1].onclick = mostrarReporteRendimiento;
  if (botones[2]) botones[2].onclick = mostrarReporteUsuarios;
});

function mostrarReporteAsistencia() {
  fetch('/api/reportes/asistencia', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      mostrarModal('Reporte de Asistencia', formatoAsistencia(data));
    })
    .catch(() => mostrarModal('Reporte de Asistencia', 'No se pudo obtener el reporte.'));
}

function mostrarReporteRendimiento() {
  fetch('/api/reportes/rendimiento', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      mostrarModal('Reporte de Rendimiento Académico', formatoRendimiento(data));
    })
    .catch(() => mostrarModal('Reporte de Rendimiento Académico', 'No se pudo obtener el reporte.'));
}

function mostrarReporteUsuarios() {
  fetch('/api/reportes/usuarios', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      mostrarModal('Reporte de Usuarios Registrados', formatoUsuarios(data));
    })
    .catch(() => mostrarModal('Reporte de Usuarios Registrados', 'No se pudo obtener el reporte.'));
}

function mostrarModal(titulo, contenido) {
  let modal = document.getElementById('modal-reporte');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-reporte';
    modal.className = 'fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h2 class="text-xl font-bold mb-4" id="modal-titulo"></h2>
        <div id="modal-contenido" class="mb-6"></div>
        <button class="bg-blue-700 text-white px-4 py-2 rounded" id="cerrar-modal">Cerrar</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#cerrar-modal').onclick = () => modal.remove();
  }
  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-contenido').innerHTML = contenido;
  modal.style.display = 'flex';
}

// Formatos simples para cada reporte
function formatoAsistencia(data) {
  if (!data || !data.estadisticas) return 'Sin datos.';
  return `<pre class='whitespace-pre-wrap'>${JSON.stringify(data.estadisticas, null, 2)}</pre>`;
}
function formatoRendimiento(data) {
  if (!data || !data.promedios) return 'Sin datos.';
  return `<pre class='whitespace-pre-wrap'>${JSON.stringify(data.promedios, null, 2)}</pre>`;
}
function formatoUsuarios(data) {
  if (!data || !data.usuarios) return 'Sin datos.';
  return `<pre class='whitespace-pre-wrap'>${JSON.stringify(data.usuarios, null, 2)}</pre>`;
}
