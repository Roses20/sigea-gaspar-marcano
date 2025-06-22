// admin-registrar-usuario.js
// Registro de nuevos usuarios (profesor o estudiante) por el administrador

document.addEventListener('DOMContentLoaded', function () {
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
      const res = await fetch('/api/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
