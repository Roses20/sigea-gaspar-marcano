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

  // IDs existentes
  let idsEstudiantes = [];
  let idsProfesores = [];

  async function fetchIds() {
    // Obtiene todos los IDs de estudiantes y profesores
    try {
      const resEst = await fetch('/api/estudiantes', { headers: { 'Authorization': 'Bearer ' + token } });
      const estudiantes = await resEst.json();
      idsEstudiantes = estudiantes.map(e => e.id_estudiante || '').filter(Boolean);
      const resProf = await fetch('/api/profesores', { headers: { 'Authorization': 'Bearer ' + token } });
      const profesores = await resProf.json();
      idsProfesores = profesores.map(p => p.id_profesor || '').filter(Boolean);
    } catch (e) {
      // Si falla, deja los arrays vacíos
      idsEstudiantes = [];
      idsProfesores = [];
    }
  }

  function generarId(tipo) {
    let ids = tipo === 'estudiante' ? idsEstudiantes : idsProfesores;
    let prefijo = tipo === 'estudiante' ? 'ST' : 'PR';
    let max = 0;
    ids.forEach(id => {
      const match = id && id.startsWith(prefijo) ? parseInt(id.slice(2)) : 0;
      if (!isNaN(match) && match > max) max = match;
    });
    let nuevo = (max + 1).toString().padStart(3, '0');
    return prefijo + nuevo;
  }

  async function setAutoId() {
    await fetchIds();
    const rol = rolSelect.value;
    if (rol === 'estudiante') {
      const id = generarId('estudiante');
      form.id_estudiante.value = id;
      form.id_estudiante.readOnly = true;
    } else if (rol === 'profesor') {
      const id = generarId('profesor');
      form.id_profesor.value = id;
      form.id_profesor.readOnly = true;
    }
  }

  function updateFields() {
    const rol = rolSelect.value;
    // Hide all by default
    idEstudianteField.style.display = 'none';
    idProfesorField.style.display = 'none';
    codigoMateriaField.style.display = 'none';
    extraFields.innerHTML = '';
    // Eliminar opción de admin si existe
    const adminOption = rolSelect.querySelector('option[value="admin"]');
    if (adminOption) adminOption.remove();
    if (rol === 'estudiante') {
      idEstudianteField.style.display = '';
      form.id_estudiante.value = '';
      form.id_estudiante.readOnly = false;
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
      form.id_profesor.value = '';
      form.id_profesor.readOnly = false;
      extraFields.innerHTML = `
        <div>
          <label for="especialidad" class="block text-sm font-medium">Especialidad</label>
          <input type="text" id="especialidad" name="especialidad" required placeholder="Ej: Matemáticas" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
        </div>
      `;
    }
  }

  rolSelect.addEventListener('change', () => {
    updateFields();
  });
  // Al cargar la página
  updateFields(); // On load

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    feedback.textContent = '';
    // Recopilar datos según el rol
    const rol = rolSelect.value;
    if (rol === 'admin') {
      feedback.textContent = 'No está permitido registrar usuarios con rol administrador.';
      return;
    }
    let body = { username: form.username.value, password: form.password.value, rol };
    if (rol === 'estudiante' && form.id_estudiante.value) {
      body.id_persona = form.id_estudiante.value;
    } else if (rol === 'profesor' && form.id_profesor.value) {
      body.id_persona = form.id_profesor.value;
    }
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('No se pudo registrar el usuario');
      feedback.textContent = 'Usuario registrado correctamente.';
      form.reset();
      updateFields();
    } catch (err) {
      feedback.textContent = err.message;
    }
  });
});
