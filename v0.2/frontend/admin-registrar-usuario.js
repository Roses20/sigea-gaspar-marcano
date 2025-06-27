// admin-registrar-usuario.js
// Registro de nuevos usuarios (profesor o estudiante) por el administrador

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

  const form = document.getElementById('form-registro-usuario');
  const feedback = document.getElementById('form-feedback');
  const extraFields = document.getElementById('extra-fields');
  const rolSelect = document.getElementById('rol');
  const idEstudianteField = document.getElementById('id-estudiante-field');
  const idProfesorField = document.getElementById('id-profesor-field');
  const codigoMateriaField = document.getElementById('codigo-materia-field');

  function updateFields() {
    const rol = rolSelect.value;
    // Hide all by default
    idEstudianteField.style.display = 'none';
    idProfesorField.style.display = 'none';
    codigoMateriaField.style.display = 'none';
    extraFields.innerHTML = '';
    if (rol === 'estudiante') {
      idEstudianteField.style.display = '';
      extraFields.innerHTML = `
        <div>
          <label for="cedula" class="block text-sm font-medium">Cédula</label>
          <input type="text" id="cedula" name="cedula" required placeholder="Ej: 12345678" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
        </div>
        <div>
          <label for="fecha_nacimiento" class="block text-sm font-medium">Fecha de nacimiento</label>
          <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" required class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
        </div>
      `;
    } else if (rol === 'profesor') {
      idProfesorField.style.display = '';
      extraFields.innerHTML = `
        <div>
          <label for="especialidad" class="block text-sm font-medium">Especialidad</label>
          <input type="text" id="especialidad" name="especialidad" required placeholder="Ej: Matemáticas" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
        </div>
      `;
    } else if (rol === 'admin') {
      // No extra fields, no ID fields
    }
  }

  rolSelect.addEventListener('change', updateFields);
  updateFields(); // On load

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    feedback.textContent = '';
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    if (!['profesor', 'estudiante'].includes(data.rol)) {
      feedback.textContent = 'Debes seleccionar un tipo de usuario válido.';
      feedback.className = 'text-red-600';
      return;
    }
    try {
      // Obtener el token del admin desde localStorage o sessionStorage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        feedback.textContent = 'No hay sesión de administrador activa.';
        feedback.className = 'text-red-600';
        return;
      }
      const res = await fetch('/api/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'No se pudo registrar el usuario');
      }
      feedback.textContent = 'Usuario registrado correctamente.';
      feedback.className = 'text-green-600';
      form.reset();
      extraFields.innerHTML = '';
    } catch (e) {
      feedback.textContent = e.message;
      feedback.className = 'text-red-600';
    }
  });
});
