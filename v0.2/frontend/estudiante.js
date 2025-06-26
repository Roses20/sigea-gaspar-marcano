// Script para mostrar datos del estudiante logueado y gestionar cierre de sesión

document.addEventListener('DOMContentLoaded', () => {
  // Buscar datos en localStorage o sessionStorage
  function getSessionItem(key) {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }
  const usuario = JSON.parse(getSessionItem('usuario'));
  const sessionTimestamp = getSessionItem('sessionTimestamp');
  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  // Si no hay usuario o no es estudiante, redirigir a login
  if (!usuario || usuario.rol !== 'estudiante') {
    window.location.href = 'login.html';
    return;
  }

  // Verificar expiración de sesión (10 minutos)
  if (!sessionTimestamp || now - Number(sessionTimestamp) > TEN_MINUTES) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
    return;
  }

  // Refrescar timestamp en cada acción del usuario
  function refreshTimestamp() {
    if (localStorage.getItem('usuario')) {
      localStorage.setItem('sessionTimestamp', Date.now());
    } else {
      sessionStorage.setItem('sessionTimestamp', Date.now());
    }
  }
  document.body.addEventListener('mousemove', refreshTimestamp);
  document.body.addEventListener('keydown', refreshTimestamp);

  // Barra superior y bienvenida
  const barra = document.querySelector('.estudiante-username');
  const bienvenida = document.querySelector('.estudiante-bienvenida');
  if (barra) {
    barra.textContent = usuario.nombre ? usuario.nombre : usuario.email;
  }
  if (bienvenida) {
    bienvenida.textContent = usuario.nombre ? usuario.nombre : usuario.email;
  }

  // Perfil (si existe)
  const nombreCompleto = document.querySelector('.estudiante-nombre');
  const correo = document.querySelector('.estudiante-correo');
  const telefono = document.querySelector('.estudiante-telefono');
  if (nombreCompleto) nombreCompleto.textContent = usuario.nombreCompleto || usuario.nombre || '';
  if (correo) correo.textContent = usuario.email || '';
  if (telefono) telefono.textContent = usuario.telefono || '';

  // Cierre de sesión para todos los botones
  const cerrarSesionBtns = document.querySelectorAll('.cerrar-sesion');
  cerrarSesionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('login.html');
    });
  });

  // --- Edición de datos personales ---
  const btnEditar = document.getElementById('editar-datos');
  const btnGuardar = document.getElementById('guardar-datos');
  const btnCancelar = document.getElementById('cancelar-edicion');
  const camposEditables = [
    document.querySelector('.estudiante-nombre'),
    document.querySelector('.estudiante-correo'),
    document.querySelector('.estudiante-telefono'),
    document.querySelector('.estudiante-ano'),
    document.querySelector('.estudiante-seccion'),
    document.querySelector('.estudiante-direccion'),
    document.querySelector('.estudiante-fecha')
  ];

  if (btnEditar && btnGuardar && btnCancelar) {
    btnEditar.addEventListener('click', () => {
      camposEditables.forEach(campo => campo && (campo.disabled = false));
      btnEditar.classList.add('hidden');
      btnGuardar.classList.remove('hidden');
      btnCancelar.classList.remove('hidden');
    });
    btnCancelar.addEventListener('click', () => {
      window.location.reload();
    });
    btnGuardar.addEventListener('click', async () => {
      // Recopilar datos con nombres correctos para el backend
      const datos = {
        nombre: camposEditables[0]?.value || '',
        email: camposEditables[1]?.value || '',
        telefono: camposEditables[2]?.value || '',
        anio: camposEditables[3]?.value || '',
        seccion: camposEditables[4]?.value || '',
        direccion: camposEditables[5]?.value || '',
        fecha_nacimiento: camposEditables[6]?.value || ''
      };
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/estudiantes/perfil', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(datos)
        });
        if (response.ok) {
          alert('Datos actualizados correctamente.');
          window.location.reload();
        } else {
          const error = await response.json();
          alert('Error al actualizar: ' + (error.message || JSON.stringify(error)));
        }
      } catch (err) {
        alert('Error de red o servidor: ' + err.message);
      }
    });
  }

  // Mostrar calificaciones reales en estudiante-calificaciones.html
  const tablaCalificaciones = document.getElementById('tabla-calificaciones');
  if (tablaCalificaciones) {
    // Obtener el id del estudiante logueado
    const estudianteId = usuario.id;
    // Llamar al backend para obtener historial de notas del estudiante
    fetch(`http://localhost:3000/api/historial-notas/${estudianteId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          tablaCalificaciones.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">No hay calificaciones registradas.</td></tr>';
          return;
        }
        // Agrupar por materia y periodo (asumiendo 3 lapsos por materia)
        const materias = {};
        data.forEach(nota => {
          const mat = nota.materia?.nombre || 'Materia';
          const periodo = nota.periodo?.nombre || 'Lapso';
          if (!materias[mat]) materias[mat] = {};
          materias[mat][periodo] = nota.nota;
        });
        // Renderizar filas
        let html = '';
        Object.entries(materias).forEach(([materia, lapsos]) => {
          const lapso1 = lapsos['Lapso 1'] ?? '';
          const lapso2 = lapsos['Lapso 2'] ?? '';
          const lapso3 = lapsos['Lapso 3'] ?? '';
          // Calcular nota final si hay al menos un lapso
          let count = 0, sum = 0;
          [lapso1, lapso2, lapso3].forEach(n => { if (n !== '') { sum += Number(n); count++; } });
          const notaFinal = count > 0 ? (sum / count).toFixed(1) : '';
          function cell(nota) {
            if (nota === '') return '<td class="border border-gray-300 px-4 py-2 text-center">-</td>';
            const aprobado = Number(nota) >= 10;
            return `<td class="border border-gray-300 px-4 py-2 text-center ${aprobado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} font-semibold">${nota}</td>`;
          }
          html += `<tr>
            <td class="border border-gray-300 px-4 py-2 font-medium">${materia}</td>
            ${cell(lapso1)}
            ${cell(lapso2)}
            ${cell(lapso3)}
            ${cell(notaFinal)}
          </tr>`;
        });
        tablaCalificaciones.innerHTML = html;
      })
      .catch(() => {
        tablaCalificaciones.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Error al cargar calificaciones.</td></tr>';
      });
  }

  // Cambios: Adaptar para mostrar y consumir id_estudiante y materias desde el endpoint REST actualizado
  // Ejemplo de consulta de materias del estudiante:
  async function cargarMateriasEstudiante() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.id_estudiante) return;
    try {
      const res = await fetch(`/api/estudiantes/${usuario.id_estudiante}/materias`);
      if (!res.ok) throw new Error('No se pudieron cargar las materias');
      const materias = await res.json();
      // Renderizar materias en la tabla o lista correspondiente
      // ...
    } catch (e) {
      // Mostrar error
    }
  }
});
