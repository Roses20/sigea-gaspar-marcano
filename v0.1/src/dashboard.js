// Script para mostrar la cantidad de estudiantes y profesores en el dashboard
// Debe incluirse en el HTML del dashboard

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/dashboard/counts');
    if (!res.ok) throw new Error('No se pudo obtener los conteos');
    const { estudiantes, profesores } = await res.json();
    document.getElementById('count-estudiantes').textContent = estudiantes;
    document.getElementById('count-profesores').textContent = profesores;
  } catch (e) {
    document.getElementById('count-estudiantes').textContent = '-';
    document.getElementById('count-profesores').textContent = '-';
  }
});
